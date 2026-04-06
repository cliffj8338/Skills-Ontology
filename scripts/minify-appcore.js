import { readFileSync, writeFileSync } from 'fs';
import { minify } from 'terser';

const src = readFileSync('dist/app-core.js', 'utf8');
const result = await minify(src, {
  compress: {
    dead_code: true,
    drop_console: false,
    passes: 2,
  },
  mangle: {
    reserved: [
      'userData', 'bpIcon', 'showToast', 'escapeHtml', 'escapeAttr',
      'initializeApp', 'BP_VERSION', 'firebase', 'db', 'auth',
      'saveToFirestore', 'loadFromFirestore'
    ],
  },
  format: {
    comments: false,
  },
});

if (result.error) {
  console.error('Minification failed:', result.error);
  process.exit(1);
}

const before = (src.length / 1024).toFixed(0);
const after = (result.code.length / 1024).toFixed(0);
const pct = ((1 - result.code.length / src.length) * 100).toFixed(1);

writeFileSync('dist/app-core.js', result.code);
console.log(`✓ app-core.js minified: ${before}KB → ${after}KB (${pct}% reduction)`);
