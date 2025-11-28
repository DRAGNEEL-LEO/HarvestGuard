const fs = require('fs');
const p = '.env.local';
if (!fs.existsSync(p)) {
  console.error('No .env.local');
  process.exit(1);
}
const s = fs.readFileSync(p, 'utf8');
console.log('--- .env.local contents ---\n' + s + '\n--- end ---');
const lines = s.split(/\r?\n/).filter(Boolean);
let ok = true;
for (const line of lines) {
  if (!/^[A-Za-z0-9_]+=/.test(line)) {
    console.error('Bad line format:', line);
    ok = false;
    continue;
  }
  const [k, v] = line.split('=', 2);
  if (v === undefined) {
    console.error('Missing value for', k);
    ok = false;
    continue;
  }
  if (/^".*"$/.test(v) || /^'.*'$/.test(v)) {
    console.error('Quoted value for', k, ':', v);
    ok = false;
  }
  if (v.includes('\n') || v.includes('\r')) {
    console.error('Value contains newline for', k);
    ok = false;
  }
  if (k.includes('URL') && !/^https?:\/\/.+/.test(v)) {
    console.error('URL value looks invalid for', k, ':', v);
    ok = false;
  }
  if (k.includes('KEY') && v.length < 20) {
    console.error('Key looks too short for', k, ': length', v.length);
    ok = false;
  }
  console.log(k, ':', v.slice(0, 40) + (v.length > 40 ? '...' : ''));
}
if (ok) console.log('All env values look OK'); else process.exit(2);
