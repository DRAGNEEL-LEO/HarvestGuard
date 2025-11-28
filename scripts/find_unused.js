#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const IGNORE_DIRS = ['.git', 'node_modules', '.next', 'dist']
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.svg', '.png', '.jpg', '.jpeg', '.json', '.md']

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      if (IGNORE_DIRS.includes(file)) continue
      results = results.concat(walk(filePath))
    } else {
      if (EXTENSIONS.includes(path.extname(file))) results.push(filePath)
    }
  }
  return results
}

function isLikelyRoute(file) {
  const rel = path.relative(ROOT, file)
  if (rel.startsWith('app' + path.sep)) return true
  if (rel.startsWith('pages' + path.sep)) return true
  return false
}

function readAllTextFiles(files) {
  const map = new Map()
  for (const f of files) {
    try {
      map.set(f, fs.readFileSync(f, 'utf8'))
    } catch (e) {
      map.set(f, '')
    }
  }
  return map
}

const allFiles = walk(ROOT)
const textFiles = allFiles.filter(f => ['.ts','.tsx','.js','.jsx','.css','.scss','.json','.md'].includes(path.extname(f)))
const textMap = readAllTextFiles(textFiles)

function occursElsewhere(targetFile) {
  const rel = path.relative(ROOT, targetFile).replace(/\\/g, '/')
  const name = path.basename(targetFile)
  const nameNoExt = name.replace(/\.[^/.]+$/, '')

  for (const [f, content] of textMap) {
    if (f === targetFile) continue
    if (!content) continue
    // search for import path or filename
    if (content.includes(rel)) return true
    if (content.includes(name)) return true
    // import by name
    const importRegex = new RegExp("\\b" + nameNoExt + "\\b", 'm')
    if (importRegex.test(content)) return true
    // referenced asset path
    if (content.includes('/images/' + name)) return true
  }
  return false
}

const unused = []
for (const f of allFiles) {
  const rel = path.relative(ROOT, f)
  // skip scripts (developer tools) and README, package files
  if (rel.startsWith('scripts' + path.sep)) continue
  if (rel === 'package.json' || rel === 'pnpm-lock.yaml' || rel === 'README.md') continue
  // keep env and config
  if (rel.endsWith('.mjs') || rel.endsWith('.json')) continue

  // don't mark routes or pages as unused
  if (isLikelyRoute(f)) continue

  if (!occursElsewhere(f)) {
    unused.push(rel)
  }
}

console.log('Scanned files:', allFiles.length)
console.log('\nPotentially unreferenced files (heuristic):')
if (unused.length === 0) {
  console.log('  (none)')
} else {
  for (const u of unused) console.log('  -', u)
}

console.log('\nNotes: This is a heuristic. Review before deleting. Files in `scripts/`, config files, or assets referenced dynamically may be false positives.')
