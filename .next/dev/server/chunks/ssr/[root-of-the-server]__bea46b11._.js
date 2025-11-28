module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Harvest_Guard/website/components/language-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function LanguageProvider({ children }) {
    const [language, setLanguageState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("en");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Load language from localStorage on mount
        const savedLanguage = localStorage.getItem("selectedLanguage");
        if (savedLanguage) {
            setLanguageState(savedLanguage);
        }
        setMounted(true);
    }, []);
    const setLanguage = (lang)=>{
        setLanguageState(lang);
        try {
            localStorage.setItem("selectedLanguage", lang);
            // If a user is logged in, also persist their preferredLanguage so
            // other pages (which read `farmer`/`currentUser`) won't overwrite it.
            const raw = localStorage.getItem("currentUser") || localStorage.getItem("farmer");
            if (raw) {
                try {
                    const obj = JSON.parse(raw);
                    if (obj && typeof obj === "object") {
                        obj.preferredLanguage = lang;
                        localStorage.setItem("currentUser", JSON.stringify(obj));
                        localStorage.setItem("farmer", JSON.stringify(obj));
                    }
                } catch (e) {
                // ignore JSON parse errors
                }
            }
        } catch (e) {
        // ignore storage errors
        }
    };
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            language,
            setLanguage
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Harvest_Guard/website/components/language-provider.tsx",
        lineNumber: 55,
        columnNumber: 10
    }, this);
}
function useLanguage() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
}),
"[project]/Harvest_Guard/website/components/theme-toggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ThemeToggle() {
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (savedTheme === "dark" || !savedTheme && prefersDark) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
        setMounted(true);
    }, []);
    const toggleTheme = ()=>{
        const newIsDark = !isDark;
        if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        setIsDark(newIsDark);
    };
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        className: "p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors",
        "aria-label": "Toggle theme",
        children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/Harvest_Guard/website/components/theme-toggle.tsx",
            lineNumber: 41,
            columnNumber: 17
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/Harvest_Guard/website/components/theme-toggle.tsx",
            lineNumber: 41,
            columnNumber: 47
        }, this)
    }, void 0, false, {
        fileName: "[project]/Harvest_Guard/website/components/theme-toggle.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/Harvest_Guard/website/lib/i18n.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "i18n",
    ()=>i18n,
    "t",
    ()=>t
]);
const i18n = {
    en: {
        nav: {
            brand: "HarvestGuard",
            dashboard: "Dashboard",
            get_started: "Get Started",
            weather: "Weather",
            risk: "Risk Analysis",
            scanner: "Crop Scanner",
            login: "Login",
            langToggle: "বাংলা"
        },
        home: {
            hero_title: "Protect Your Harvest with Intelligence",
            hero_badge: "AI-Powered Farming Solution",
            hero_subtitle: "Reduce food loss with AI-powered monitoring, real-time weather insights, and smart predictions",
            hero_cta: "Get Start",
            hero_secondary: "Watch Demo",
            problem_intro: "The Challenge",
            problem_stat1: "4.5M",
            problem_stat1_desc: "tonnes of grain lost yearly in Bangladesh",
            problem_stat2: "$1.5B",
            problem_stat2_desc: "economic impact annually",
            problem_stat3: "12–32%",
            problem_stat3_desc: "of staple foods wasted in supply chain",
            features_title: "Powerful Tools Built for Farmers",
            features_subtitle: "Everything you need to monitor, predict, and protect your crops",
            feature_monitor: {
                title: "Real-time Monitoring",
                desc: "Keep an eye on crop health with AI-powered insights"
            },
            feature_predict: {
                title: "Smart Predictions",
                desc: "Forecast risks and harvest outcomes before they happen"
            },
            feature_health: {
                title: "Health Diagnosis",
                desc: "Detect pests and diseases early with image-based diagnostics"
            },
            feature_offline: {
                title: "Offline Support",
                desc: "Work reliably in low-connectivity areas with offline-first features"
            },
            feature_bangla: {
                title: "Bangla Support",
                desc: "Local language UI and crop names for farmer convenience"
            },
            feature_rewards: {
                title: "Incentives & Rewards",
                desc: "Earn recognition and benefits for reducing post-harvest loss"
            },
            cta_title: "Ready to transform your farming?",
            cta_button: "Begin Now",
            cta_dashboard: "Go to Dashboard",
            testimonial_title: "Field Trial —2025",
            testimonial_sub: "Reduced post-harvest loss by 28% in trial sites",
            footer_tagline: "Reducing food loss in Bangladesh through innovation and technology",
            getting_started: {
                title: "Getting Started",
                step1: {
                    title: "Create an account",
                    desc: "Register with your email to save batches and settings."
                },
                step2: {
                    title: "Add your crops",
                    desc: "Add crop batches with harvest dates and storage locations."
                },
                step3: {
                    title: "Scan & monitor",
                    desc: "Use the crop scanner and dashboard to monitor health and weather."
                }
            },
            features_heading: "Why farmers choose HarvestGuard",
            how_title: "How HarvestGuard Works",
            how_step1_title: "Scan your crops",
            how_step1_desc: "Use the mobile scanner to capture photos of your batch and get instant insights.",
            how_step2_title: "Monitor & predict",
            how_step2_desc: "Real-time monitoring and AI-based forecasts help you plan harvest and storage.",
            how_step3_title: "Protect your harvest",
            how_step3_desc: "Receive actionable alerts and recommendations to reduce loss and maximize yield.",
            testimonial_1_text: "HarvestGuard helped us reduce post-harvest loss and make faster decisions in the field.",
            testimonial_1_author: "— Local Cooperative, Bangladesh",
            trust_heading: "Trusted by cooperatives and farms"
        },
        login: {
            title: "Sign In to HarvestGuard",
            subtitle: "Access your crop monitoring dashboard",
            email: "Email Address",
            password: "Password",
            email_placeholder: "your@email.com",
            password_placeholder: "Enter your password",
            sign_in: "Sign In",
            no_account: "Don't have an account?",
            register: "Register here",
            demo_mode: "Demo Mode",
            demo_button: "Try Demo Account",
            signing_in: "Signing in...",
            back: "Back",
            resend_confirmation: "Resend confirmation",
            forgot_password: "Forgot password?"
        },
        dashboard: {
            title: "Dashboard",
            welcome: "Welcome",
            profile: "Profile",
            crops: "My Crops",
            new_batch: "Add New Batch",
            export_data: "Export Data",
            logout: "Logout",
            no_batches: "No active crop batches yet. Start by adding one.",
            loading: "Loading your data...",
            please_login: "Please log in first",
            go_to_login: "Go to Login"
        },
        news: {
            title: "Agricultural News & Insights",
            subtitle: "Latest updates from Bangladesh agriculture sector",
            read_more: "Read More",
            loading: "Loading articles...",
            no_articles: "No articles found",
            categories: {
                all: "All Articles",
                news: "News",
                research: "Research",
                journal: "Journal Articles"
            },
            by: "By",
            published: "Published",
            latest: "Latest News",
            latest_sub: "Agriculture and tech updates",
            show_more: "Read more",
            show_less: "Show less",
            error: "Error loading news"
        },
        cropForm: {
            title: "Add New Crop Batch",
            crop_type: "Crop Type",
            weight: "Estimated Weight (kg)",
            harvest_date: "Harvest Date",
            storage_location: "Storage Location (Division)",
            storage_type: "Storage Type",
            cancel: "Cancel",
            submit: "Register Batch"
        }
    },
    bn: {
        nav: {
            brand: "HarvestGuard",
            dashboard: "ড্যাশবোর্ড",
            get_started: "শুরু করুন",
            weather: "আবহাওয়া",
            risk: "ঝুঁকি বিশ্লেষণ",
            scanner: "ফসল স্ক্যানার",
            login: "লগইন",
            langToggle: "EN"
        },
        home: {
            hero_title: "বুদ্ধিমত্তার সাথে আপনার ফসল রক্ষা করুন",
            hero_badge: "AI-চালিত কৃষি সমাধান",
            hero_subtitle: "AI-চালিত পর্যবেক্ষণ, রিয়েল-টাইম আবহাওয়া অন্তর্দৃষ্টি এবং স্মার্ট পূর্বাভাস দিয়ে খাদ্য ক্ষতি কমান",
            hero_cta: "শুরু করুন",
            hero_secondary: "ডেমো দেখুন",
            problem_intro: "চ্যালেঞ্জ",
            problem_stat1: "৪.৫M",
            problem_stat1_desc: "বাংলাদেশে বার্ষিক হারিয়ে যাওয়া শস্য টন",
            problem_stat2: "$১.৫B",
            problem_stat2_desc: "বার্ষিক অর্থনৈতিক প্রভাব",
            problem_stat3: "১২–৩২%",
            problem_stat3_desc: "সরবরাহ চেইনে নষ্ট হওয়া মূল খাদ্য",
            features_title: "কৃষকদের জন্য শক্তিশালী সরঞ্জাম",
            features_subtitle: "আপনার ফসল পর্যবেক্ষণ, পূর্বাভাস এবং সুরক্ষার জন্য প্রয়োজনীয় সবকিছু",
            feature_monitor: {
                title: "রিয়েল-টাইম পর্যবেক্ষণ",
                desc: "AI-চালিত অন্তর্দৃষ্টির মাধ্যমে ফসলের স্বাস্থ্য নজর রাখুন"
            },
            feature_predict: {
                title: "স্মার্ট পূর্বাভাস",
                desc: "ঝুঁকি এবং ফলনের পূর্বাভাস জানুন"
            },
            feature_health: {
                title: "স্বাস্থ্য নির্ণয়",
                desc: "ছবি-ভিত্তিক নির্ণয়ের মাধ্যমে কীটপতঙ্গ এবং রোগ দ্রুত শনাক্ত করুন"
            },
            feature_offline: {
                title: "অফলাইন সমর্থন",
                desc: "কম সংযোগ এলাকায় অফলাইন-ফার্স্ট বৈশিষ্ট্য সহ কাজ করুন"
            },
            feature_bangla: {
                title: "বাংলা সমর্থন",
                desc: "কৃষকের সুবিধার জন্য বাংলা UI এবং ফসলের নাম"
            },
            feature_rewards: {
                title: "প্রণোদনা ও পুরস্কার",
                desc: "ফসলক্ষতি কমানোর জন্য স্বীকৃতি এবং সুবিধা পান"
            },
            cta_title: "আপনার কৃষিকে রূপান্তরিত করতে প্রস্তুত?",
            cta_button: "এখনই শুরু করুন",
            cta_dashboard: "ড্যাশবোর্ডে যান",
            testimonial_title: "ফিল্ড ট্রায়াল — ২০২৫",
            testimonial_sub: "ট্রায়াল সাইটে পোস্ট-হারভেস্ট ক্ষতি ২৮% কমিয়েছে",
            footer_tagline: "উদ্ভাবন এবং প্রযুক্তির মাধ্যমে বাংলাদেশে খাদ্য ক্ষতি কমানো",
            getting_started: {
                title: "শুরু করার নির্দেশিকা",
                step1: {
                    title: "অ্যাকাউন্ট তৈরি করুন",
                    desc: "ইমেইলের মাধ্যমে রেজিস্টার করে ব্যাচ ও সেটিং সংরক্ষণ করুন।"
                },
                step2: {
                    title: "আপনার ফসল যোগ করুন",
                    desc: "ফসলের ব্যাচ যোগ করুন — কাটার তারিখ ও সংরক্ষণ স্থান দিন।"
                },
                step3: {
                    title: "স্ক্যান ও পর্যবেক্ষণ",
                    desc: "স্ক্যানার ব্যবহার করে ফসলের স্বাস্থ্য ও আবহাওয়া দেখুন।"
                }
            },
            features_heading: "কেন কৃষকরা HarvestGuard বেছে নেন",
            how_title: "HarvestGuard কিভাবে কাজ করে",
            how_step1_title: "আপনার ফসল স্ক্যান করুন",
            how_step1_desc: "মোবাইল স্ক্যানার ব্যবহার করে ব্যাচের ছবি নিন এবং তাৎক্ষণিক অন্তর্দৃষ্টি পান।",
            how_step2_title: "পর্যবেক্ষণ ও পূর্বাভাস",
            how_step2_desc: "রিয়েল-টাইম মনিটরিং ও AI-ভিত্তিক পূর্বাভাস আপনাকে কাটার ও সংরক্ষণ পরিকল্পনায় সহায়তা করে।",
            how_step3_title: "আপনার ফসল রক্ষা করুন",
            how_step3_desc: "ক্ষয় কমাতে এবং ফলন বাড়াতে কার্যকর সতর্কতা এবং সুপারিশ পান।",
            testimonial_1_text: "HarvestGuard আমাদের পোস্ট-হারভেস্ট ক্ষতি কমাতে এবং মাঠে দ্রুত সিদ্ধান্ত নিতে সহায়তা করেছে।",
            testimonial_1_author: "— স্থানীয় সমবায়, বাংলাদেশ",
            trust_heading: "সমবায় এবং খামারগুলো আমাদের বিশ্বাস করে"
        },
        login: {
            title: "HarvestGuard এ সাইন ইন করুন",
            subtitle: "আপনার ফসল পর্যবেক্ষণ ড্যাশবোর্ড অ্যাক্সেস করুন",
            email: "ইমেইল ঠিকানা",
            password: "পাসওয়ার্ড",
            email_placeholder: "your@email.com",
            password_placeholder: "আপনার পাসওয়ার্ড লিখুন",
            sign_in: "সাইন ইন করুন",
            no_account: "অ্যাকাউন্ট নেই?",
            register: "এখানে রেজিস্টার করুন",
            demo_mode: "ডেমো মোড",
            demo_button: "ডেমো অ্যাকাউন্ট চেষ্টা করুন",
            signing_in: "সাইন ইন হচ্ছে...",
            back: "ফিরে যান",
            resend_confirmation: "কনফার্মেশন পুনরায় পাঠান",
            forgot_password: "পাসওয়ার্ড ভুলে গেছেন?"
        },
        dashboard: {
            title: "ড্যাশবোর্ড",
            welcome: "স্বাগতম",
            profile: "প্রোফাইল",
            crops: "আমার ফসল",
            new_batch: "নতুন ব্যাচ যোগ করুন",
            export_data: "ডেটা রপ্তানি করুন",
            logout: "লগ আউট",
            no_batches: "এখনও কোনো সক্রিয় ফসলের ব্যাচ নেই। একটি যোগ করে শুরু করুন।",
            loading: "আপনার ডেটা লোড হচ্ছে...",
            please_login: "প্রথমে লগ ইন করুন",
            go_to_login: "লগইন করুন"
        },
        news: {
            title: "কৃষি সংবাদ এবং অন্তর্দৃষ্টি",
            subtitle: "বাংলাদেশ কৃষি খাতের সর্বশেষ আপডেট",
            read_more: "আরও পড়ুন",
            loading: "নিবন্ধ লোড হচ্ছে...",
            no_articles: "কোনো নিবন্ধ পাওয়া যায়নি",
            categories: {
                all: "সমস্ত নিবন্ধ",
                news: "সংবাদ",
                research: "গবেষণা",
                journal: "জার্নাল নিবন্ধ"
            },
            by: "লেখক",
            published: "প্রকাশিত",
            latest: "সর্বশেষ সংবাদ",
            latest_sub: "কৃষি এবং প্রযুক্তি আপডেট",
            show_more: "আরও পড়ুন",
            show_less: "কম দেখান",
            error: "সংবাদ লোড করতে ত্রুটি"
        },
        cropForm: {
            title: "নতুন ফসলের ব্যাচ যোগ করুন",
            crop_type: "ফসলের ধরন",
            weight: "আনুমানিক ওজন (কেজি)",
            harvest_date: "ফসল কাটার তারিখ",
            storage_location: "সংরক্ষণ স্থান (বিভাগ)",
            storage_type: "সংরক্ষণ প্রকার",
            cancel: "বাতিল করুন",
            submit: "ব্যাচ নিবন্ধন করুন"
        }
    }
};
const t = (lang, path)=>{
    const parts = path.split(".");
    // @ts-ignore
    let cur = i18n[lang];
    for (const p of parts){
        if (!cur) return undefined;
        cur = cur[p];
    }
    return cur;
};
}),
"[project]/Harvest_Guard/website/lib/supabase/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/module/index.js [app-ssr] (ecmascript) <locals>");
;
let supabase = null;
function createClient() {
    if (supabase) return supabase;
    const url = ("TURBOPACK compile-time value", "https://ttkauryruxwcaobhskoc.supabase.co");
    const anonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0a2F1cnlydXh3Y2FvYmhza29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzkyMTQsImV4cCI6MjA3OTgxNTIxNH0.5wCVE6PyzcBJL4QRZc5ZZEtyLrcTufp4TB0O_FaM66c");
    supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$0$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, anonKey);
    return supabase;
}
}),
"[project]/Harvest_Guard/website/components/navigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navigation",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/leaf.js [app-ssr] (ecmascript) <export default as Leaf>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$components$2f$language$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/components/language-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/components/theme-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/lib/i18n.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/lib/supabase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Harvest_Guard/website/node_modules/.pnpm/next@16.0.3_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
function Navigation({ currentPage }) {
    const [mobileOpen, setMobileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { language, setLanguage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$components$2f$language$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const navLabels = __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i18n"][language].nav;
    const navItems = [
        {
            href: "/weather",
            label: navLabels.weather,
            id: "weather"
        },
        {
            href: "/risk-analysis",
            label: navLabels.risk,
            id: "risk"
        },
        {
            href: "/crop-scanner",
            label: navLabels.scanner,
            id: "scanner"
        },
        {
            href: "/news-articles",
            label: __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$lib$2f$i18n$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i18n"][language].news?.latest || "News",
            id: "news"
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function loadUser() {
            try {
                const stored = ("TURBOPACK compile-time value", "undefined") !== "undefined" && (localStorage.getItem("currentUser") || localStorage.getItem("farmer"));
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                // fall back to reading from supabase client session if present
                const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
                const { data, error } = await supabase.auth.getUser();
                if (!error && data?.user) {
                    const u = data.user;
                    const normalized = {
                        id: u.id,
                        name: u.user_metadata?.name ?? u.email?.split('@')[0],
                        email: u.email
                    };
                    // eslint-disable-next-line no-console
                    console.debug('[nav] loaded user from supabase session', normalized);
                    setCurrentUser(normalized);
                } else {
                    setCurrentUser(null);
                }
            } catch (e) {
                // ignore read errors
                setCurrentUser(null);
            }
        }
        loadUser();
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: listener } = supabase.auth.onAuthStateChange((event, session)=>{
            if (session?.user) {
                const u = session.user;
                const normalized = {
                    id: u.id,
                    name: u.user_metadata?.name ?? u.email?.split('@')[0],
                    email: u.email
                };
                setCurrentUser(normalized);
            } else {
                setCurrentUser(null);
            }
        });
        return ()=>{
            try {
                listener?.subscription.unsubscribe();
            } catch  {}
        };
    }, [
        pathname,
        language
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed top-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 bg-background/70 backdrop-blur-md border border-border rounded-2xl shadow-[var(--elev-1)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto px-4 sm:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center h-20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-3 font-bold text-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-11 h-11 bg-gradient-to-br from-primary to-primary/90 rounded-lg flex items-center justify-center ring-1 ring-primary/10 shadow-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$leaf$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Leaf$3e$__["Leaf"], {
                                        className: "w-6 h-6 text-primary-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/images/harvestguard-wordmark.svg",
                                    alt: navLabels.brand,
                                    className: "h-6 sm:h-8 block",
                                    onError: (e)=>{
                                        e.currentTarget.style.display = "none";
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: navLabels.brand
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard",
                                    className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
                                    children: navLabels.dashboard
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`,
                                        children: item.label
                                    }, item.id, false, {
                                        fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)),
                                !currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/register",
                                    className: "ml-3 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md",
                                    children: navLabels.get_started || (language === "en" ? "Get Started" : "শুরু করুন")
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 126,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard",
                                    className: "hidden md:inline-block px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80",
                                    children: currentUser.name || currentUser.email?.split('@')[0] || navLabels.dashboard
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/login",
                                    className: "hidden md:inline-block px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80",
                                    children: navLabels.login
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$components$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setLanguage(language === "en" ? "bn" : "en"),
                                    className: "px-3 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors",
                                    children: navLabels.langToggle
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setMobileOpen(!mobileOpen),
                                    className: "md:hidden p-2 hover:bg-muted rounded-lg",
                                    children: mobileOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                        lineNumber: 153,
                                        columnNumber: 29
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                        lineNumber: 153,
                                        columnNumber: 57
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                mobileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:hidden pb-4 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted",
                            onClick: ()=>setMobileOpen(false),
                            children: navLabels.dashboard
                        }, void 0, false, {
                            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this),
                        navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: `block px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted`,
                                onClick: ()=>setMobileOpen(false),
                                children: item.label
                            }, item.id, false, {
                                fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this)),
                        currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted",
                            onClick: ()=>setMobileOpen(false),
                            children: currentUser.name || currentUser.email?.split('@')[0] || navLabels.dashboard
                        }, void 0, false, {
                            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                            lineNumber: 174,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Harvest_Guard$2f$website$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$3_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/login",
                            className: "block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted",
                            onClick: ()=>setMobileOpen(false),
                            children: navLabels.login
                        }, void 0, false, {
                            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                            lineNumber: 178,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Harvest_Guard/website/components/navigation.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bea46b11._.js.map