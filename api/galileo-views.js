// api/galileo-views.js
// Increments the Galileo page view counter and returns the total.
// POST — increment + return new total
// GET  — return current total without incrementing
//
// Stored in Firestore: analytics/galileo_public (same collection as airoi)
// Fields: { total: number, unique: number }
// Firestore rules already allow public read/write on analytics/galileo_public.
// Add this to the existing analytics rule or add a new galileo_public doc.

import { fsGet, fsSet } from './lib/firestore-rest.js';

const COL = 'analytics';
const DOC = 'galileo_public';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://myblueprint.work');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  let currentTotal = 0;
  try {
    const current = await fsGet(COL, DOC);
    currentTotal = current ? (current.total || 0) : 0;
  } catch (e) {
    // Doc doesn't exist yet — start from 0
    currentTotal = 0;
  }

  try {
    if (req.method === 'POST') {
      const newTotal = currentTotal + 1;
      await fsSet(COL, DOC, { total: newTotal });
      return res.status(200).json({ total: newTotal });
    }
    return res.status(200).json({ total: currentTotal });
  } catch (err) {
    console.error('[galileo-views]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
