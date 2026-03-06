import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();
const DIRS = ['src', 'api', 'public'];
const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const HTML_CSS_EXTS = new Set(['.html', '.css']);
const SKIP = ['node_modules', '.git', '.local', 'dist', 'attached_assets'];

function walk(dir) {
  let results = { js: 0, html: 0, css: 0, files: 0 };
  try {
    for (const entry of readdirSync(dir)) {
      if (SKIP.includes(entry)) continue;
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        const sub = walk(full);
        results.js += sub.js;
        results.html += sub.html;
        results.css += sub.css;
        results.files += sub.files;
      } else {
        const ext = extname(entry).toLowerCase();
        if (EXTS.has(ext)) {
          const lines = readFileSync(full, 'utf8').split('\n').length;
          results.js += lines;
          results.files++;
        } else if (ext === '.html') {
          const lines = readFileSync(full, 'utf8').split('\n').length;
          results.html += lines;
          results.files++;
        } else if (ext === '.css') {
          const lines = readFileSync(full, 'utf8').split('\n').length;
          results.css += lines;
          results.files++;
        }
      }
    }
  } catch (e) {}
  return results;
}

let totals = { js: 0, html: 0, css: 0, files: 0 };

for (const dir of DIRS) {
  const sub = walk(join(ROOT, dir));
  totals.js += sub.js;
  totals.html += sub.html;
  totals.css += sub.css;
  totals.files += sub.files;
}

const rootFiles = ['index.html', 'blueprint.css'];
for (const f of rootFiles) {
  try {
    const lines = readFileSync(join(ROOT, f), 'utf8').split('\n').length;
    const ext = extname(f);
    if (ext === '.html') totals.html += lines;
    else if (ext === '.css') totals.css += lines;
    totals.files++;
  } catch (e) {}
}

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const vParts = pkg.version.split('.');
let totalDeploys = parseInt(vParts[2] || 0);
if (parseInt(vParts[1] || 0) >= 45) totalDeploys += 79;
if (parseInt(vParts[1] || 0) >= 46) totalDeploys += 100;

const stats = {
  lineCount: totals.js + totals.html + totals.css,
  jsLines: totals.js,
  htmlLines: totals.html,
  cssLines: totals.css,
  fileCount: totals.files,
  version: pkg.version,
  totalDeploys: totalDeploys,
  buildDate: new Date().toISOString()
};

writeFileSync(join(ROOT, 'public', 'build-stats.json'), JSON.stringify(stats));
console.log('Build stats:', stats);
