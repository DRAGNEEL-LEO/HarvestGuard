#!/usr/bin/env node
// Preview script: finds duplicate files (by SHA1) and prints suggested `git rm` commands
// It keeps the first path in each duplicate group and suggests removing the rest.
// Usage: node scripts/duplicate_preview.js

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
  console.log('Scanning files for duplicates...')
  const files = walk(ROOT)
  const map = new Map()
  for (const f of files) {
    if (f.includes(path.join(ROOT, '.git')) || f.includes(path.join(ROOT, 'node_modules')) || f.includes(path.join(ROOT, '.next'))) continue
    try {
      const h = sha1(f)
      if (!map.has(h)) map.set(h, [])
      map.get(h).push(path.relative(ROOT, f))
    } catch (err) {
      // ignore unreadable files
    }
  }

  const duplicates = Array.from(map.values()).filter((arr) => arr.length > 1)
  if (duplicates.length === 0) {
    console.log('No duplicate files found.')
    return
  }

  console.log('\nDuplicate groups found. Preview of `git rm` commands (preview only):\n')
  duplicates.forEach((group, idx) => {
    console.log('Group %d:', idx + 1)
    group.forEach((p, i) => {
      console.log('  %d) %s', i + 1, p)
    })
    // keep first, suggest rm for others
    const keep = group[0]
    const toRemove = group.slice(1)
    console.log('\n  Keep: %s', keep)
    console.log('  Suggested remove commands:')
    toRemove.forEach((p) => console.log('    git rm --cached -- %s', p))
    console.log('\n---\n')
  })
  console.log('Note: Commands are printed with `--cached` to avoid immediate local deletion from working tree; remove `--cached` if you want to delete files from disk as well.')
}

main()
