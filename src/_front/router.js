import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

import wwPage from './views/wwPage.vue';

import {
    initializeData,
    initializePlugins,
    initializeIntegrationInstances,
    onPageUnload,
} from '@/_common/helpers/data';
import { convertPathToRouterFormat } from '@/_common/helpers/urlParametersParsing';
import { getRuntimeEnvironment } from '@/helpers/frontEnv.js';
import { useBackAuthStore } from '@/pinia/backAuth.js';
/* wwFront:start */
import { isStaticRenderingActive } from '@/_front/rendering/staticRenderingContext';
/* wwFront:end */

/**
 * @typedef {import('vue-router').Router} Router
 * @typedef {import('vue-router').RouteRecordRaw} RouteRecordRaw
 * @typedef {import('vue-router').RouterOptions} RouterOptions
 * @typedef {import('vue-router').RouterScrollBehavior} RouterScrollBehavior
 */

/**
 * @typedef {Object} Lang
 * @property {string} lang
 * @property {boolean} [default]
 * @property {boolean} [isDefaultPath]
 */

/**
 * @typedef {Object} PageSecurity
 * @property {'authenticated' | string} [accessRule]
 * @property {string[]} [accessRoles]
 * @property {'AND' | 'OR'} [accessRolesCondition]
 */

/**
 * @typedef {Object} Page
 * @property {string} id
 * @property {Record<string, string> & { default: string }} paths
 * @property {string[]} langs
 * @property {PageSecurity} [security]
 * @property {{ userGroup: string }[]} [pageUserGroups]
 */

/**
 * @typedef {Object} DesignInfo
 * @property {string} homePageId
 * @property {Page[]} pages
 * @property {Lang[]} langs
 * @property {unknown} [auth]
 * @property {{ href?: string }} [baseTag]
 */

/** @type {Router} */
let router;
/** @type {RouteRecordRaw[]} */
const routes = [];

/** @type {RouterScrollBehavior} */
const scrollBehavior = to => {
    if (to.hash) {
        return {
            el: to.hash,
            behavior: 'smooth',
        };
    } else {
        return { top: 0 };
    }
};

 
/* wwFront:start */
import pluginsSettings from '../../plugins-settings.json';

window.wwg_designInfo = {"id":"1b8147da-2812-42a5-946e-f83c582d3071","homePageId":"991a8992-afed-4eaf-b77e-13a81380ad12","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"back":{"isServerSetup":{"staging":false,"production":false}},"auth":null,"pages":[{"id":"3515bd43-f827-4437-9a36-759c037406e2","linkId":"3515bd43-f827-4437-9a36-759c037406e2","name":"Terms of Service","folder":null,"paths":{"en":"terms","default":"terms"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"223a113f-795f-40e7-918c-1030558ff397","sectionTitle":"TOS Section","linkId":"101fd215-db71-4963-a72b-231353f9b148"}],"pageUserGroups":[],"title":{"en":"Terms of Service | Whispering Woods Luxe"},"meta":{"desc":{"en":"Terms of Service for The Estate Senior Experience — estate retainer, weather, model release, liability, and booking terms."},"keywords":{"en":"terms of service, Whispering Woods Luxe, senior portraits, non-refundable estate retainer"},"socialDesc":{"en":"Terms of Service for booking The Estate Senior Experience at Whispering Woods Luxe."},"socialTitle":{"en":"Terms of Service | Whispering Woods Luxe"},"structuredData":{"en":{}}},"metaImage":"","security":{}},{"id":"8afee215-521b-4113-bef6-5df22fbce128","linkId":"8afee215-521b-4113-bef6-5df22fbce128","name":"Privacy Policy","folder":null,"paths":{"en":"privacypolicy","default":"privacypolicy"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"5bcca274-c72c-4cdb-bfa6-2d5738b67ef6","sectionTitle":"Privacy Section","linkId":"6b6787b7-1db0-42ce-8b0f-543b063861cb"}],"pageUserGroups":[],"title":{"en":"Privacy Policy | Whispering Woods Luxe"},"meta":{"desc":{"en":"Privacy Policy for Whispering Woods Luxe — how we collect, use, and protect booking and estate retainer data."},"keywords":{"en":"privacy policy, Whispering Woods Luxe, estate retainer, data protection"},"socialDesc":{"en":"Privacy Policy for Whispering Woods Luxe booking and heirloom orders."},"socialTitle":{"en":"Privacy Policy | Whispering Woods Luxe"},"structuredData":{"en":{}}},"metaImage":"","security":{}},{"id":"991a8992-afed-4eaf-b77e-13a81380ad12","linkId":"991a8992-afed-4eaf-b77e-13a81380ad12","name":"Home","folder":null,"paths":{"default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"68072bf6-8fbe-4292-acd2-a776d68bc1fe","sectionTitle":"Hero Section","linkId":"5b1c263b-e701-4a7e-805e-6c90d0402810"},{"uid":"c1decbbc-0fd8-4fb8-848c-3b8bf3f03a84","sectionTitle":"The Feeling Section","linkId":"09990f33-288c-4dbf-af15-432b88a121a2"},{"uid":"ce564ca4-129c-4705-95e9-933aa9acfe0a","sectionTitle":"Sticky Bottom Navigation","linkId":"7b6ff986-dfd4-4c01-83c4-a8072fb5f2d8"},{"uid":"612ce5bc-58e2-4291-a7ca-e8dc2328bde4","sectionTitle":"The Venue Preview Section","linkId":"b41c6326-21cc-4de2-a8a4-f9842cdbc2d3"},{"uid":"27640e69-0353-4596-93ef-e3e46f76f63b","sectionTitle":"Mom Social Proof Section","linkId":"7115f644-6969-410f-b899-03f2a0024edb"},{"uid":"5bb3a0e5-6c21-499e-a039-83e5191039de","sectionTitle":"Typical Estate Day Section","linkId":"eeac3120-ffa0-4084-b13b-7175877d5037"},{"uid":"992fdc23-13a6-469a-9688-59e3a9d83f44","sectionTitle":"The Chalet Section","linkId":"71fdcf59-43d9-481f-9774-f876e08f3074"},{"uid":"75a60e34-fade-48ca-b55f-3f519ed6993d","sectionTitle":"The Pricing Section","linkId":"31d2e2b1-84a9-4373-b30e-7ab77f4a72e6"},{"uid":"bec45f57-9991-4f15-aff4-12b79ca5bceb","sectionTitle":"Is This Right for You Section","linkId":"0a5d6d8c-38bf-4b11-8269-86a6be5fe2a3"},{"uid":"764a2540-26d1-426e-aae9-77f443757b84","sectionTitle":"The FAQ Section","linkId":"2381667f-b078-44b7-bbf4-e6ce0488aad8"},{"uid":"53096ef1-d851-4b59-b3ee-55909b5f3273","sectionTitle":"The Final Tour CTA Section","linkId":"ba43e511-d437-4d1d-99d0-29d3019a1d40"},{"uid":"26cf5117-2d1e-4d60-a840-0a5bba841075","sectionTitle":"Footer Section","linkId":"f1833ffd-79f9-4ab5-850b-f4e79e0a96ef"}],"pageUserGroups":[],"title":{"en":"Class of 2027 Private Estate Senior Portraits | Whispering Woods Luxe · Whispering Woods Estate"},"meta":{"desc":{"en":"Class of 2027 private estate senior portraits on 40 acres at Whispering Woods Estate. $1,420 all-inclusive · $710 estate retainer secures your appointment. October 18, 2026 inaugural day · 24 appointments. Barrington, Hinsdale, Lake Forest, North Shore."},"keywords":{"en":"Class of 2027 senior portraits, estate retainer senior photos, Whispering Woods Luxe, private estate senior portraits Illinois, luxury senior photos estate, Barrington senior portraits, North Shore luxury senior portraits"},"socialDesc":{"en":"Forty private acres · Class of 2027 estate senior portraits. $1,420 experience · $710 retainer secures your spot. 24 inaugural appointments · October 18, 2026."},"socialTitle":{"en":"Class of 2027 Private Estate Senior Portraits | Whispering Woods Luxe · Whispering Woods Estate"},"structuredData":{"en":{"url":"https://whisperingwoodsluxe.com","name":"The Estate Senior Experience · Class of 2027 · Whispering Woods Estate","offers":[1420],"startDate":"2026-10-18","areaServed":["Barrington, IL","Hinsdale, IL","Lake Forest, IL","Lake Geneva, WI","Chicago North Shore"],"priceCurrency":"USD"}}},"metaImage":"https://whisperingwoodsluxe.com/wwluxe-og-1200x630.webp","security":{}}],"plugins":[{"id":"00d22f72-1a03-44f8-ad68-c593dc80b543","name":"Stripe","namespace":"stripe"},{"id":"69d4a5bb-09a3-4f3d-a94e-667c21c057eb","name":"NPM","namespace":"npm"},{"id":"1c5f5c0f-5609-4031-9e57-5bb4811be7b3","name":"Youtube","namespace":"youtube"},{"id":"66a79c98-70e7-4bc4-8859-20776b024ec2","name":"PWA","namespace":"pwa"},{"id":"60610cfd-fa28-4fc1-9e72-088b5c667e81","name":"Calendly","namespace":"calendly"},{"id":"832d6f7a-42c3-43f1-a3ce-9a678272f811","name":"Date","namespace":"dayjs"},{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"},{"id":"cd33cf33-e29f-4e8c-ac26-b997fe507ce7","name":"Xano","namespace":"xano"}]};
window.wwg_cacheVersion = 41;
window.wwg_pluginsSettings = pluginsSettings;
window.wwg_disableManifest = false;

/** @type {Lang} */
const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {
    lang: 'en',
    default: true,
};
const isServerRendering = import.meta.env.SSR;

/**
 * @param {Page} page
 * @param {Lang} lang
 * @param {string} [forcedPath]
 */
const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    path = convertPathToRouterFormat(path);

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
            lang,
            isPrivate: !!page.pageUserGroups?.length,
        },
        async beforeEnter(to, from) {
            if (to.name === from.name) return;
            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            if (!isStaticRenderingActive()) {
                const canContinue = await initializePageRuntime(page, to);
                if (!canContinue) return null;
            }

            try {
                const { default: registerPageComponents } = await import(`@/pages/${page.id.split('_')[0]}.js`);
                await registerPageComponents(window.vm);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (isStaticRenderingActive()) {
                    return;
                } else if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return;
            } catch (err) {
                wwLib.$store.dispatch('front/showPageLoadProgress', false);
                if (isStaticRenderingActive()) throw err;

                if (err.redirectUrl) {
                    return { path: err.redirectUrl || '404' };
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
if (page404) {
    for (const lang of window.wwg_designInfo.langs) {
        // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
        if (!page404.langs.includes(lang.lang)) continue;
        registerRoute(
            page404,
            {
                default: false,
                lang: lang.lang,
            },
            '/:pathMatch(.*)*'
        );
    }
    // Create route /:pathMatch(.*)* using default project lang
    registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
} else {
    routes.push({
        path: '/:pathMatch(.*)*',
        redirect: null,
        async beforeEnter() {
            window.location.href = '/404';
        },
    });
}

const isProd = getRuntimeEnvironment() === 'production';

async function initializePageRuntime(page, route) {
    const backAuthStore = useBackAuthStore(wwLib.$pinia);
    if (!wwLib.wwAuth.plugin && !backAuthStore.projectAuth && window.wwg_designInfo.auth) {
        backAuthStore.setProjectAuth(window.wwg_designInfo.auth);
    }

    await initializePlugins();
    await initializeIntegrationInstances();

    if (!wwLib.wwAuth.plugin) {
        await backAuthStore.refresh();
        const projectAuth = backAuthStore.projectAuth || {};

        if (page.security?.accessRule !== 'authenticated') return true;
        if (!backAuthStore.isAuthenticated) {
            window.location.href = `${wwLib.wwPageHelper.getPagePath(
                projectAuth.unauthenticatedPageId
            )}?_source=${route.path}`;
            return false;
        }
        if (!page.security.accessRoles?.length) return true;

        const hasAccess =
            page.security.accessRolesCondition === 'AND'
                ? backAuthStore.matchAllRoles(page.security.accessRoles)
                : backAuthStore.matchAnyRoles(page.security.accessRoles);
        if (hasAccess) return true;

        window.location.href = `${wwLib.wwPageHelper.getPagePath(
            projectAuth.unauthorizedPageId
        )}?_source=${route.path}`;
        return false;
    }

    if (!page.pageUserGroups?.length) return true;
    await wwLib.wwAuth.init();

    if (!wwLib.wwAuth.getIsAuthenticated()) {
        window.location.href = `${wwLib.wwPageHelper.getPagePath(
            wwLib.wwAuth.getUnauthenticatedPageId()
        )}?_source=${route.path}`;
        return false;
    }

    if (
        page.pageUserGroups.length > 1 &&
        !wwLib.wwAuth.matchUserGroups(page.pageUserGroups.map(({ userGroup }) => userGroup))
    ) {
        window.location.href = `${wwLib.wwPageHelper.getPagePath(
            wwLib.wwAuth.getUnauthorizedPageId()
        )}?_source=${route.path}`;
        return false;
    }

    return true;
}

/**
 * Initializes the current route's traditional runtime dependencies after Vue has
 * hydrated the static projection. Static rendering remains active until this resolves,
 * so client islands and dynamic bindings cannot run against a partial runtime.
 */
export async function initializeCurrentRouteRuntime() {
    const route = router.currentRoute.value;
    const page = window.wwg_designInfo.pages.find(candidate => candidate.id === route.meta.pageId);
    if (!page) throw new Error(`Unable to initialize runtime for route ${route.fullPath}: page is unavailable.`);

    const canContinue = await initializePageRuntime(page, route);
    if (!canContinue) return { status: 'redirected' };
    return { status: 'ready', route };
}

/**
 * Starts the data phase without delaying the mounted lifecycle, matching normal
 * navigation where collections and workflows may initialize after the first render.
 */
export function startCurrentRouteDataInitialization(route) {
    return initializeData(route);
}

function createFrontHistory(serverRendering) {
    if (serverRendering) return createMemoryHistory();

    if (isProd && window.wwg_designInfo.baseTag?.href) {
        let baseTag = window.wwg_designInfo.baseTag.href;
        if (!baseTag.startsWith('/')) {
            baseTag = '/' + baseTag;
        }
        if (!baseTag.endsWith('/')) {
            baseTag += '/';
        }
        return createWebHistory(baseTag);
    }

    return createWebHistory();
}

export function createFrontRouter({ serverRendering = false } = {}) {
    const frontRouter = createRouter({
        history: createFrontHistory(serverRendering),
        routes,
        scrollBehavior,
    });

    //Trigger on page unload
    let isFirstNavigation = true;
    frontRouter.beforeEach(async (to, from) => {
        if (to.name === from.name) return;
        if (!isFirstNavigation && !serverRendering) await onPageUnload();
        isFirstNavigation = false;
        wwLib.globalVariables._navigationId++;
        return;
    });

    //Init page
    frontRouter.afterEach((to, from, failure) => {
        wwLib.$store.dispatch('front/showPageLoadProgress', false);
        let fromPath = from.path;
        let toPath = to.path;
        if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
        if (!toPath.endsWith('/')) toPath = toPath + '/';
        if (failure || (from.name && toPath === fromPath) || serverRendering || isStaticRenderingActive()) return;
        void initializeData(to);
    });

    return frontRouter;
}

router = createFrontRouter({ serverRendering: isServerRendering });
/* wwFront:end */

export default router;
