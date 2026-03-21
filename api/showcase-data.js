import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

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

const SHOWCASE_KEY = 'bp-aKqWMR8AJli-tFPr8p3IJA32';
const ADMIN_UID = process.env.SHOWCASE_ADMIN_UID || '';

const ALLOWED_ORIGINS = [
    'https://myblueprint.work',
    'https://www.myblueprint.work',
    'http://localhost:3000',
    'http://localhost:5000'
];

function cors(req, res) {
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
    cors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const key = req.query.key;
    if (!key || key !== SHOWCASE_KEY) {
        return res.status(403).json({ error: 'Invalid showcase key' });
    }

    if (!ADMIN_UID) {
        return res.status(500).json({ error: 'SHOWCASE_ADMIN_UID not configured' });
    }

    try {
        const type = req.query.type || 'all';
        const result = {};

        if (type === 'all' || type === 'blueprints') {
            const wbSnap = await db.collection('users').doc(ADMIN_UID)
                .collection('work_blueprints').orderBy('savedAt', 'desc').get();
            result.work_blueprints = [];
            wbSnap.forEach(doc => {
                result.work_blueprints.push({ id: doc.id, ...doc.data() });
            });
        }

        if (type === 'all' || type === 'comparisons') {
            const compSnap = await db.collection('users').doc(ADMIN_UID)
                .collection('comparisons').orderBy('savedAt', 'desc').get();
            result.saved_comparisons = [];
            compSnap.forEach(doc => {
                result.saved_comparisons.push({ id: doc.id, ...doc.data() });
            });
        }

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).json(result);
    } catch (err) {
        console.error('Showcase data fetch error:', err);
        return res.status(500).json({ error: 'Failed to fetch showcase data' });
    }
}
