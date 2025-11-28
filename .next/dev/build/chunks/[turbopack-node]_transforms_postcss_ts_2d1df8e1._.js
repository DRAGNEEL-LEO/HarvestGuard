module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/Harvest_Guard/website/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/cbcee__pnpm_cc74a512._.js",
  "chunks/[root-of-the-server]__70827d8b._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/Harvest_Guard/website/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];