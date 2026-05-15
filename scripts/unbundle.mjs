import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { gunzipSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const HTML_PATH = join(ROOT, 'fitai-demo.html');
const OUT_DIR = join(__dirname, 'extracted');
const FONTS_DIR = join(ROOT, 'public', 'fonts');

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(FONTS_DIR, { recursive: true });

const html = readFileSync(HTML_PATH, 'utf8');

// Extract manifest
const manifestMatch = html.match(/<script[^>]*type="__bundler\/manifest"[^>]*>([\s\S]*?)<\/script>/);
if (!manifestMatch) { console.error('manifest not found'); process.exit(1); }
const manifest = JSON.parse(manifestMatch[1]);

// Extract template
const templateMatch = html.match(/<script[^>]*type="__bundler\/template"[^>]*>([\s\S]*?)<\/script>/);
if (!templateMatch) { console.error('template not found'); process.exit(1); }
const template = JSON.parse(templateMatch[1]);

console.log(`Found ${Object.keys(manifest).length} assets in manifest\n`);

// Decode and write each asset
const jsFiles = [];
let fontCount = 0;

for (const [uuid, entry] of Object.entries(manifest)) {
  const binaryStr = Buffer.from(entry.data, 'base64');
  let bytes = binaryStr;

  if (entry.compressed) {
    try {
      bytes = gunzipSync(binaryStr);
    } catch (e) {
      console.warn(`Could not decompress ${uuid}: ${e.message}`);
    }
  }

  const mime = entry.mime || '';

  if (mime.includes('woff') || mime.includes('font')) {
    const fontFile = join(FONTS_DIR, `font-${++fontCount}.woff2`);
    writeFileSync(fontFile, bytes);
    console.log(`[font] ${uuid.slice(0, 8)}... → public/fonts/font-${fontCount}.woff2 (${bytes.length} bytes)`);
  } else if (mime.includes('javascript') || mime.includes('text/babel') || mime.includes('jsx') || mime === '') {
    jsFiles.push({ uuid, bytes, entry });
  } else {
    console.log(`[skip] ${uuid.slice(0, 8)}... mime=${mime}`);
  }
}

// Write JS files in order they appear in the template
const uuidOrder = [];
const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
let m;
while ((m = uuidRegex.exec(template)) !== null) {
  const uuid = m[0];
  if (!uuidOrder.includes(uuid) && manifest[uuid]) {
    uuidOrder.push(uuid);
  }
}

const orderedJs = uuidOrder
  .map(uuid => jsFiles.find(f => f.uuid === uuid))
  .filter(Boolean);

// Also add any JS files not found in template order
for (const f of jsFiles) {
  if (!orderedJs.find(o => o.uuid === f.uuid)) {
    orderedJs.push(f);
  }
}

for (let i = 0; i < orderedJs.length; i++) {
  const { uuid, bytes, entry } = orderedJs[i];
  const content = bytes.toString('utf8');
  const filename = `module-${String(i + 1).padStart(2, '0')}.js`;
  writeFileSync(join(OUT_DIR, filename), content);
  const preview = content.slice(0, 80).replace(/\n/g, ' ');
  console.log(`[js]   ${uuid.slice(0, 8)}... → scripts/extracted/${filename} (${bytes.length} bytes)`);
  console.log(`       ${preview}`);
}

// Extract CSS from template
const templateDoc = template;
const cssMatches = [...templateDoc.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
const allCss = cssMatches.map(m => m[1]).join('\n\n');
if (allCss) {
  writeFileSync(join(OUT_DIR, 'styles.css'), allCss);
  console.log(`\n[css]  Extracted ${cssMatches.length} <style> blocks → scripts/extracted/styles.css (${allCss.length} chars)`);
}

// Save full template for inspection
writeFileSync(join(OUT_DIR, 'template.html'), template);
console.log(`[html] Full template → scripts/extracted/template.html`);

console.log('\nDone!');
