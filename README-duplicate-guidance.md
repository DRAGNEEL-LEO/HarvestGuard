Duplicate files guidance

This repository now includes `scripts/find_duplicates.js` which scans the repo for files with identical content and prints groups of duplicates.

How to run locally:

```bash
node scripts/find_duplicates.js
```

What it shows:
- For each group, the script lists all files that are byte-for-byte identical.

Next steps (manual):
- Review each group and decide which path to keep and which to remove.
- To remove a duplicate, run `git rm <path>` for the file(s) you want deleted, commit, and push.

Important:
- The script intentionally ignores `.git`, `node_modules`, and `.next`.
- Review assets and components carefully before deleting; do not delete files you aren't 100% sure are duplicates needed only in one place.

If you want, I can:
- (A) Propose an automated delete script that deletes the second+ file in each duplicate group (I will show a preview before any deletion), or
- (B) Run the duplicate finder and then open a shortlist here for you to approve files to remove.

Which do you prefer?