#!/usr/bin/env node
// Finds duplicate files in the workspace by SHA1 hash and prints groups.
// Usage: node scripts/find_duplicates.js

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = path.resolve(__dirname, '..')
const IGNORE_DIRS = ['.git', 'node_modules', '.next']

function walk(dir) {
  const res = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (IGNORE_DIRS.includes(e.name)) continue
    if (e.isDirectory()) {
      res.push(...walk(full))
    } else if (e.isFile()) {
      res.push(full)
    }
  }
  return res
}

function sha1(file) {
  const data = fs.readFileSync(file)
  return crypto.createHash('sha1').update(data).digest('hex')
}

function main() {
  console.log('Scanning files...')
  const files = walk(ROOT)
  const map = new Map()
  for (const f of files) {
    // skip scripts folder itself
    if (f.includes('/.git/') || f.includes('/node_modules/') || f.includes('/.next/')) continue
    try {
      const h = sha1(f)
      if (!map.has(h)) map.set(h, [])
      map.get(h).push(path.relative(ROOT, f))
    } catch (err) {
      // ignore unreadable files
    }
  }

  const duplicates = Array.from(map.entries()).filter(([h, arr]) => arr.length > 1)
  if (duplicates.length === 0) {
    console.log('No duplicate files found.')
    return
  }

  console.log('Duplicate file groups (by content):')
  duplicates.forEach(([h, arr], idx) => {
    console.log('\nGroup %d (hash=%s):', idx + 1, h)
    arr.forEach((p) => console.log('  -', p))
  })
  console.log('\nTo remove duplicates: review groups above and delete unwanted files manually, or run `node scripts/delete_duplicate_choice.js` after modifying to your preference.')
}

main()
