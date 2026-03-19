// lib/firestore-rest.js
// Firestore REST API helpers — no firebase-admin SDK required.
// Uses the Firebase Web API key (already public in Blueprint client code).
//
// Add ONE env var to Vercel:
//   FIREBASE_API_KEY  — same key already in your Blueprint front-end config
//   (Settings → Environment Variables → add FIREBASE_API_KEY)
//
// Firestore rules for galileo_counter must allow public write:
//   match /galileo_counter/{doc} {
//     allow read: if true;
//     allow write: if true;   ← change this from false
//   }
// Data is non-sensitive (article counts). No user data stored here.

const PROJECT_ID = 'work-blueprint';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function key() {
  const k = process.env.FIREBASE_API_KEY;
  if (!k) throw new Error('FIREBASE_API_KEY env var not set');
  return k;
}

// ── Serialize JS value → Firestore field value ────────────────────────────────
function toFirestore(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val)
      ? { integerValue: String(val) }
      : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestore) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) fields[k] = toFirestore(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = toFirestore(v);
  return { fields };
}

// ── Deserialize Firestore field value → JS value ──────────────────────────────
function fromFirestore(fv) {
  if (!fv) return null;
  if ('nullValue' in fv) return null;
  if ('booleanValue' in fv) return fv.booleanValue;
  if ('integerValue' in fv) return parseInt(fv.integerValue, 10);
  if ('doubleValue' in fv) return fv.doubleValue;
  if ('stringValue' in fv) return fv.stringValue;
  if ('arrayValue' in fv) return (fv.arrayValue.values || []).map(fromFirestore);
  if ('mapValue' in fv) return fromFields(fv.mapValue.fields || {});
  return null;
}

function fromFields(fields) {
  const obj = {};
  for (const [k, v] of Object.entries(fields || {})) obj[k] = fromFirestore(v);
  return obj;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fsGet(collection, docId) {
  const url = `${BASE}/${collection}/${docId}?key=${key()}`;
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore GET failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();
  return fromFields(doc.fields || {});
}

export async function fsSet(collection, docId, data) {
  const url = `${BASE}/${collection}/${docId}?key=${key()}`;
  const body = toFields(data);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Firestore SET failed: ${res.status} ${await res.text()}`);
  return true;
}

export async function fsUpdate(collection, docId, partialData) {
  // PATCH with updateMask so we only touch specified fields
  const fieldPaths = Object.keys(partialData).join(',');
  const url = `${BASE}/${collection}/${docId}?key=${key()}&updateMask.fieldPaths=${encodeURIComponent(fieldPaths)}`;
  const body = toFields(partialData);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Firestore UPDATE failed: ${res.status} ${await res.text()}`);
  return true;
}
