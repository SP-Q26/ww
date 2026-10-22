import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import wewebCssLayerPlugin from './weweb-postcss-layer-plugin.cjs';
import path from 'path';
import fs from 'fs';
import { parseEnv } from 'node:util';
import handlebars from 'handlebars';
import { createSsrPageComponentLoadersPlugin } from './vitePlugins/ssrPageComponentLoaders.ts';

const pages = {"81e5d604-f110-4cc1-b384-b2728c3bd483-en":{"outputDir":"./","lang":"en","title":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL","cacheVersion":"16","meta":[{"name":"title","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"name":"description","content":"Field notes, wedding planning tips, engagement session ideas, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},{"name":"keywords","content":"whispering woods journal, whispering woods weddings, whispering woods events, harvard il wedding venue, lake geneva weddings, private estate buyout, engagement photos Harvard IL, estate engagement session Lake Geneva, engagement pictures private estate Illinois, outdoor wedding illinois, estate senior portraits"},{"name":"image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"itemprop":"name","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"itemprop":"description","content":"Field notes, wedding planning tips, engagement session ideas, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},{"itemprop":"image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"name":"twitter:description","content":"Field notes, engagement sessions on the estate, and weekend buyout planning across forty private acres."},{"name":"twitter:image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"property":"og:title","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"property":"og:description","content":"Field notes, engagement sessions on the estate, and weekend buyout planning across forty private acres."},{"property":"og:image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"property":"og:site_name","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"<!-- WW Journal · Project → Custom code → Head (paste before GitHub publish) -->\n<!-- Slim head · 46 posts in git public/wwj-posts.json — NOT inlined here -->\n<!-- After catalog edit: journal-catalog.mjs build-public → push SP-Q26/ww journal → Vercel -->\n\n<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/images/48-wwj-favicon.png\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/images/192-wwj-favicon.png\" />\n<link rel=\"apple-touch-icon\" sizes=\"192x192\" href=\"/images/192-wwj-favicon.png\" />\n\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\" />\n<meta name=\"theme-color\" content=\"#141F19\" />\n<meta property=\"og:site_name\" content=\"Whispering Woods Journal\" />\n<meta property=\"og:locale\" content=\"en_US\" />\n<meta name=\"twitter:card\" content=\"summary_large_image\" />\n\n<link rel=\"canonical\" href=\"https://www.whisperingwoodsweddings.com/\" id=\"wwj-canonical\" />\n<script src=\"/wwj-root-router.js\"></script>\n<link rel=\"stylesheet\" href=\"/wwj-wildlife-train.css?v=2026-10-22\" />\n<script src=\"/wwj-posts-hydrate.js?v=2026-10-22\" defer></script>\n<script src=\"/wwj-feed-story-count.js?v=2026-10-22\" defer></script>\n<script src=\"/wwj-field-notes-week.js?v=2026-10-22\" defer></script>\n<script src=\"/wwj-wildlife-train.js?v=2026-10-22\" defer></script>\n<script>\n(function () {\n  var SITE = \"https://www.whisperingwoodsweddings.com\";\n  function canonPath() {\n    var path = (location.pathname || \"/\").replace(/\\/+$/, \"\") || \"/\";\n    if (path === \"/home\") return \"/\";\n    return path;\n  }\n  function setCanonical() {\n    var path = canonPath();\n    var href = SITE + (path === \"/\" ? \"/\" : path);\n    var el = document.getElementById(\"wwj-canonical\");\n    if (!el) {\n      el = document.createElement(\"link\");\n      el.id = \"wwj-canonical\";\n      el.rel = \"canonical\";\n      document.head.appendChild(el);\n    }\n    el.href = href;\n    var og = document.querySelector('meta[property=\"og:url\"]');\n    if (!og) {\n      og = document.createElement(\"meta\");\n      og.setAttribute(\"property\", \"og:url\");\n      document.head.appendChild(og);\n    }\n    og.setAttribute(\"content\", href);\n  }\n  function boot() {\n    setCanonical();\n    var _push = history.pushState;\n    var _replace = history.replaceState;\n    history.pushState = function () {\n      _push.apply(this, arguments);\n      setCanonical();\n    };\n    history.replaceState = function () {\n      _replace.apply(this, arguments);\n      setCanonical();\n    };\n    window.addEventListener(\"popstate\", setCanonical);\n  }\n  if (document.readyState === \"loading\") {\n    document.addEventListener(\"DOMContentLoaded\", boot);\n  } else {\n    boot();\n  }\n})();\n\n</script>\n\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/"},{"rel":"alternate","hreflang":"en","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/"}]},"7f21e17b-ce85-4010-b215-ce0ffb3558cf-en":{"outputDir":"./p/:param","lang":"en","title":"Whispering Woods Journal · Wedding & Estate Portrait Tips","cacheVersion":"16","meta":[{"name":"title","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"name":"description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"name":"keywords","content":"whispering woods weddings, whispering woods events, whispering woods luxe, wedding guide, estate tips, lake geneva weddings, senior portraits"},{"name":"image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"itemprop":"name","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"itemprop":"description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"itemprop":"image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"name":"twitter:description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"name":"twitter:image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"property":"og:title","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"property":"og:description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"property":"og:image","content":"/images/384-wwj-favicon.png?_wwcv=16"},{"property":"og:site_name","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"<!-- WW Journal · Project → Custom code → Head (paste before GitHub publish) -->\n<!-- Slim head · 46 posts in git public/wwj-posts.json — NOT inlined here -->\n<!-- After catalog edit: journal-catalog.mjs build-public → push SP-Q26/ww journal → Vercel -->\n\n<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/images/48-wwj-favicon.png\" />\n<link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/images/192-wwj-favicon.png\" />\n<link rel=\"apple-touch-icon\" sizes=\"192x192\" href=\"/images/192-wwj-favicon.png\" />\n\n<meta name=\"robots\" content=\"index, follow, max-image-preview:large\" />\n<meta name=\"theme-color\" content=\"#141F19\" />\n<meta property=\"og:site_name\" content=\"Whispering Woods Journal\" />\n<meta property=\"og:locale\" content=\"en_US\" />\n<meta name=\"twitter:card\" content=\"summary_large_image\" />\n\n<link rel=\"canonical\" href=\"https://www.whisperingwoodsweddings.com/\" id=\"wwj-canonical\" />\n<script src=\"/wwj-root-router.js\"></script>\n<link rel=\"stylesheet\" href=\"/wwj-wildlife-train.css?v=2026-10-22\" />\n<script src=\"/wwj-posts-hydrate.js?v=2026-10-22\" defer></script>\n<script src=\"/wwj-feed-story-count.js?v=2026-10-22\" defer></script>\n<script src=\"/wwj-field-notes-week.js?v=2026-10-22\" defer></script>\n<script src=\"/wwj-wildlife-train.js?v=2026-10-22\" defer></script>\n<script>\n(function () {\n  var SITE = \"https://www.whisperingwoodsweddings.com\";\n  function canonPath() {\n    var path = (location.pathname || \"/\").replace(/\\/+$/, \"\") || \"/\";\n    if (path === \"/home\") return \"/\";\n    return path;\n  }\n  function setCanonical() {\n    var path = canonPath();\n    var href = SITE + (path === \"/\" ? \"/\" : path);\n    var el = document.getElementById(\"wwj-canonical\");\n    if (!el) {\n      el = document.createElement(\"link\");\n      el.id = \"wwj-canonical\";\n      el.rel = \"canonical\";\n      document.head.appendChild(el);\n    }\n    el.href = href;\n    var og = document.querySelector('meta[property=\"og:url\"]');\n    if (!og) {\n      og = document.createElement(\"meta\");\n      og.setAttribute(\"property\", \"og:url\");\n      document.head.appendChild(og);\n    }\n    og.setAttribute(\"content\", href);\n  }\n  function boot() {\n    setCanonical();\n    var _push = history.pushState;\n    var _replace = history.replaceState;\n    history.pushState = function () {\n      _push.apply(this, arguments);\n      setCanonical();\n    };\n    history.replaceState = function () {\n      _replace.apply(this, arguments);\n      setCanonical();\n    };\n    window.addEventListener(\"popstate\", setCanonical);\n  }\n  if (document.readyState === \"loading\") {\n    document.addEventListener(\"DOMContentLoaded\", boot);\n  } else {\n    boot();\n  }\n})();\n\n</script>\n\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/p/:param/"},{"rel":"alternate","hreflang":"en","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/p/:param/"}]}};

function generatePageHtmlFiles() {
    const template = fs.readFileSync(path.resolve(__dirname, 'template.html'), 'utf-8');
    const compiledTemplate = handlebars.compile(template);

    for (const pageConfig of Object.values(pages)) {
        const html = compiledTemplate({
            title: pageConfig.title,
            lang: pageConfig.lang,
            meta: pageConfig.meta,
            structuredData: pageConfig.structuredData || null,
            scripts: {
                head: pageConfig.scripts.head,
                body: pageConfig.scripts.body,
            },
            alternateLinks: pageConfig.alternateLinks,
            cacheVersion: pageConfig.cacheVersion,
            baseTag: pageConfig.baseTag,
            encodedAssetBase: encodeURIComponent("/"),
        });

        if (!fs.existsSync(pageConfig.outputDir)) {
            fs.mkdirSync(pageConfig.outputDir, { recursive: true });
        }
        fs.writeFileSync(`${pageConfig.outputDir}/index.html`, html);
    }
}

const clientInputs = {};
for (const pageName in pages) {
    clientInputs[pageName] = path.resolve(__dirname, pages[pageName].outputDir, 'index.html');
}

function getFrontEnvironmentValues(root, mode) {
    const filePath = path.resolve(root, `.env.${mode}`);
    if (!fs.existsSync(filePath)) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(parseEnv(fs.readFileSync(filePath, 'utf8'))).filter(([key]) => !key.startsWith('VITE_'))
    );
}

const onwarn = (entry, next) => {
    if (entry.loc?.file && /js$/.test(entry.loc.file) && /Use of eval in/.test(entry.message)) return;
    if (/Use of direct `eval`/.test(entry.message)) return;
    return next(entry);
};

export default defineConfig(({ mode, isSsrBuild }) => {
    if (!isSsrBuild) {
        generatePageHtmlFiles();
    }

    const build = {
        chunkSizeWarningLimit: 10000,
        ...(!isSsrBuild ? { manifest: '.ww-client-manifest.json' } : {}),
        rolldownOptions: {
            ...(!isSsrBuild ? { input: clientInputs } : {}),
            onwarn,
        },
    };

    if (isSsrBuild) {
        build.outDir = 'dist-ssr';
    }

    return {
        plugins: [createSsrPageComponentLoadersPlugin(), vue()],
        base: "/",
        define: {
            global: 'globalThis',
            __VUE_PROD_DEVTOOLS__: mode === 'development',
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:
                mode === 'development' || !!process.env.WW_BACK_URL?.includes('weweb-preprod.io'),
            __WW_FRONT_ENV_VARIABLES__: JSON.stringify({
                staging: getFrontEnvironmentValues(__dirname, 'staging'),
                production: getFrontEnvironmentValues(__dirname, 'production'),
            }),
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
            postcss: {
                plugins: [wewebCssLayerPlugin({ include: [/[/\\]src[/\\]extensions[/\\]/, /[/\\]node_modules[/\\]/] }), autoprefixer],
            },
        },
        ssr: {
            noExternal: true,
        },
        server: {
            port: 8080,
        },
        build,
    };
});
