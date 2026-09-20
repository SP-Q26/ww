import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import wewebCssLayerPlugin from './weweb-postcss-layer-plugin.cjs';
import path from 'path';
import fs from 'fs';
import { parseEnv } from 'node:util';
import handlebars from 'handlebars';
import { createSsrPageComponentLoadersPlugin } from './vitePlugins/ssrPageComponentLoaders.ts';

const pages = {"7f21e17b-ce85-4010-b215-ce0ffb3558cf-en":{"outputDir":"./p/:param","lang":"en","title":"Whispering Woods Journal · Wedding & Estate Portrait Tips","cacheVersion":"7","meta":[{"name":"title","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"name":"description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"name":"keywords","content":"whispering woods weddings, whispering woods events, whispering woods luxe, wedding guide, estate tips, lake geneva weddings, senior portraits"},{"itemprop":"name","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"itemprop":"description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"name":"twitter:description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"property":"og:title","content":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},{"property":"og:description","content":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},{"property":"og:site_name","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/p/:param/"},{"rel":"alternate","hreflang":"en","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/p/:param/"}]},"81e5d604-f110-4cc1-b384-b2728c3bd483-en":{"outputDir":"./","lang":"en","title":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL","cacheVersion":"7","meta":[{"name":"title","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"name":"description","content":"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},{"name":"keywords","content":"whispering woods journal, whispering woods weddings, whispering woods events, whispering woods luxe, harvard il wedding venue, lake geneva weddings, private estate buyout, outdoor wedding illinois, estate senior portraits, 40 private acres, three natural ponds, chalet wedding suite, outdoor ceremony tips"},{"itemprop":"name","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"itemprop":"description","content":"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},{"name":"twitter:card","content":"summary"},{"name":"twitter:title","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"name":"twitter:description","content":"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},{"property":"og:title","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"property":"og:description","content":"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},{"property":"og:site_name","content":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},{"property":"og:type","content":"website"},{"name":"robots","content":"index, follow"}],"scripts":{"head":"\n","body":"\n"},"baseTag":{"href":"/","target":"_self"},"alternateLinks":[{"rel":"alternate","hreflang":"x-default","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/"},{"rel":"alternate","hreflang":"en","href":"https://49bf8d2b-9224-4aa4-803a-5b74f1a83f30.weweb-preview.io/"}]}};

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
