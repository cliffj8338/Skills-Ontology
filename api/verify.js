// /api/verify.js — Vercel Serverless Function
// Token-based verification endpoint for Blueprint™
// No auth required — verifiers access via unique token URL
//
// GET  /api/verify?token=X&uid=Y  → returns pending verification records
// POST /api/verify                → submits verifier response

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

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

const ALLOWED_ORIGINS = [
    'https://myblueprint.work',
    'https://www.myblueprint.work',
    'http://localhost:3000',
    'http://localhost:5000'
];

function getCorsOrigin(origin) {
    return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

const rateLimits = new Map();
const RATE_WINDOW_MS = 60000;
const RATE_MAX_REQUESTS = 30;

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimits.get(ip);
    if (!entry || (now - entry.start) > RATE_WINDOW_MS) {
        rateLimits.set(ip, { start: now, count: 1 });
        return true;
    }
    entry.count++;
    return entry.count <= RATE_MAX_REQUESTS;
}

function sanitizeString(str, maxLen) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>"'&]/g, '').substring(0, maxLen);
}

export default async function handler(req, res) {
    const origin = req.headers.origin || '';
    const allowedOrigin = getCorsOrigin(origin);
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
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
    
    if (!/^vrf-/.test(token) || token.length > 100) {
        return res.status(400).json({ error: 'Invalid token format' });
    }

    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(uid)) {
        return res.status(400).json({ error: 'Invalid uid format' });
    }
    
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ error: 'No pending verifications found for this token' });
    }
    
    const data = userDoc.data();
    const verifications = data.verifications || [];
    
    const records = verifications.filter(v => v.token === token && v.status === 'pending');
    
    if (records.length === 0) {
        const completed = verifications.filter(v => v.token === token && v.status !== 'pending');
        if (completed.length > 0) {
            return res.status(410).json({ error: 'Verification already completed', status: completed[0].status });
        }
        return res.status(404).json({ error: 'No pending verifications found for this token' });
    }
    
    const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const activeRecords = records.filter(r => {
        if (!r.requestedAt) return true;
        return (now - new Date(r.requestedAt).getTime()) < EXPIRY_MS;
    });
    
    if (activeRecords.length === 0) {
        return res.status(410).json({ error: 'Verification request has expired' });
    }
    
    return res.status(200).json({
        records: activeRecords.map(r => ({
            id: r.id,
            skillName: sanitizeString(r.skillName, 200),
            claimedLevel: sanitizeString(r.claimedLevel, 50),
            evidenceSummary: sanitizeString(r.evidenceSummary, 500),
            relationship: sanitizeString(r.relationship, 50),
            verifierName: sanitizeString(r.verifierName, 100)
        })),
        profileName: data.profile ? sanitizeString(data.profile.name, 100) : 'A professional'
    });
}

async function handlePost(req, res) {
    const body = req.body || {};
    const { token, uid, responses, note, verifierName, respondedAt } = body;
    
    if (!token || !uid || !responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Missing required fields: token, uid, responses' });
    }
    
    if (!/^vrf-/.test(token) || token.length > 100) {
        return res.status(400).json({ error: 'Invalid token format' });
    }

    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(uid)) {
        return res.status(400).json({ error: 'Invalid uid format' });
    }

    if (responses.length > 50) {
        return res.status(400).json({ error: 'Too many responses' });
    }

    const VALID_RESPONSES = ['confirm', 'decline', 'Novice', 'Proficient', 'Advanced', 'Expert', 'Mastery'];
    for (const r of responses) {
        if (typeof r !== 'string' || !VALID_RESPONSES.includes(r)) {
            return res.status(400).json({ error: 'Invalid response value: ' + String(r).substring(0, 30) });
        }
    }
    
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const data = userDoc.data();
    const verifications = data.verifications || [];
    
    const records = verifications.filter(v => v.token === token && v.status === 'pending');
    
    if (records.length === 0) {
        return res.status(410).json({ error: 'No pending verifications for this token' });
    }
    
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
                verifications[vIdx].confirmedLevel = response;
            } else {
                verifications[vIdx].confirmedLevel = rec.claimedLevel;
            }
        }
        
        verifications[vIdx].respondedAt = respondedAt || new Date().toISOString();
        verifications[vIdx].verifierNote = sanitizeString(note, 1000);
        if (verifierName) verifications[vIdx].verifierName = sanitizeString(verifierName, 100);
        
        bestRelationship = rec.relationship || bestRelationship;
        updated++;
    });
    
    await db.collection('users').doc(uid).update({ verifications: verifications });
    
    const weight = credibilityWeights[bestRelationship] || 1.2;
    const label = credibilityLabels[weight] || 'Basic';
    
    return res.status(200).json({
        success: true,
        updated: updated,
        profileName: data.profile ? sanitizeString(data.profile.name, 100) : 'A professional',
        credibilityWeight: weight,
        credibilityLabel: label
    });
}
