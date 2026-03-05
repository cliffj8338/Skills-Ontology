// /api/verify.js — Vercel Serverless Function
// Token-based verification endpoint for Blueprint™
// No auth required — verifiers access via unique token URL
//
// GET  /api/verify?token=X&uid=Y  → returns pending verification records
// POST /api/verify                → submits verifier response

import admin from 'firebase-admin';

// Initialize Firebase Admin (reuse across invocations)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        })
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        if (req.method === 'GET') {
            return await handleGet(req, res);
        } else if (req.method === 'POST') {
            return await handlePost(req, res);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (err) {
        console.error('Verify API error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

async function handleGet(req, res) {
    const { token, uid } = req.query;
    
    if (!token || !uid) {
        return res.status(400).json({ error: 'Missing token or uid parameter' });
    }
    
    // Validate token format (basic sanity check)
    if (!/^vrf-/.test(token) || token.length > 100) {
        return res.status(400).json({ error: 'Invalid token format' });
    }
    
    // Fetch user document
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const data = userDoc.data();
    const verifications = data.verifications || [];
    
    // Find pending records matching this token
    const records = verifications.filter(v => v.token === token && v.status === 'pending');
    
    if (records.length === 0) {
        // Check if already completed
        const completed = verifications.filter(v => v.token === token && v.status !== 'pending');
        if (completed.length > 0) {
            return res.status(410).json({ error: 'Verification already completed', status: completed[0].status });
        }
        return res.status(404).json({ error: 'No pending verifications found for this token' });
    }
    
    // Check expiry (30 days)
    const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const activeRecords = records.filter(r => {
        if (!r.requestedAt) return true;
        return (now - new Date(r.requestedAt).getTime()) < EXPIRY_MS;
    });
    
    if (activeRecords.length === 0) {
        return res.status(410).json({ error: 'Verification request has expired' });
    }
    
    // Return records with profile name (sanitized — no email or PII)
    return res.status(200).json({
        records: activeRecords.map(r => ({
            id: r.id,
            skillName: r.skillName,
            claimedLevel: r.claimedLevel,
            evidenceSummary: (r.evidenceSummary || '').substring(0, 500),
            relationship: r.relationship,
            verifierName: r.verifierName
        })),
        profileName: data.profile ? data.profile.name : 'A professional'
    });
}

async function handlePost(req, res) {
    const { token, uid, responses, note, verifierName, respondedAt } = req.body;
    
    if (!token || !uid || !responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Missing required fields: token, uid, responses' });
    }
    
    // Validate token format
    if (!/^vrf-/.test(token) || token.length > 100) {
        return res.status(400).json({ error: 'Invalid token format' });
    }
    
    // Fetch user document
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const data = userDoc.data();
    const verifications = data.verifications || [];
    
    // Find pending records matching this token
    const records = verifications.filter(v => v.token === token && v.status === 'pending');
    
    if (records.length === 0) {
        return res.status(410).json({ error: 'No pending verifications for this token' });
    }
    
    // Credibility weights for response
    const credibilityWeights = {
        'Manager': 2.0, 'Executive': 2.0,
        'Client': 1.8, 'Board Member': 1.8, 'Co-founder': 1.8,
        'Colleague': 1.5, 'Industry Peer': 1.5, 'Peer': 1.5,
        'Direct Report': 1.3,
        'Other': 1.2
    };
    
    const credibilityLabels = {
        2.0: 'Highest', 1.8: 'High', 1.5: 'Standard', 1.3: 'Basic', 1.2: 'Basic'
    };
    
    // Apply responses to matching records
    let updated = 0;
    let bestRelationship = 'Other';
    
    records.forEach((rec, idx) => {
        const response = responses[idx] || 'confirm';
        const vIdx = verifications.findIndex(v => v.id === rec.id);
        if (vIdx < 0) return;
        
        if (response === 'decline') {
            verifications[vIdx].status = 'declined';
        } else {
            verifications[vIdx].status = 'confirmed';
            if (response !== 'confirm') {
                verifications[vIdx].confirmedLevel = response; // Suggested different level
            } else {
                verifications[vIdx].confirmedLevel = rec.claimedLevel;
            }
        }
        
        verifications[vIdx].respondedAt = respondedAt || new Date().toISOString();
        verifications[vIdx].verifierNote = (note || '').substring(0, 1000);
        if (verifierName) verifications[vIdx].verifierName = verifierName.substring(0, 100);
        
        bestRelationship = rec.relationship || bestRelationship;
        updated++;
    });
    
    // Save back to Firestore
    await db.collection('users').doc(uid).update({ verifications: verifications });
    
    const weight = credibilityWeights[bestRelationship] || 1.2;
    const label = credibilityLabels[weight] || 'Basic';
    
    return res.status(200).json({
        success: true,
        updated: updated,
        profileName: data.profile ? data.profile.name : 'A professional',
        credibilityWeight: weight,
        credibilityLabel: label
    });
}
