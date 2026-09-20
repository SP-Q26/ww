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

window.wwg_designInfo = {"id":"49bf8d2b-9224-4aa4-803a-5b74f1a83f30","homePageId":"81e5d604-f110-4cc1-b384-b2728c3bd483","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[],"back":{"isServerSetup":{"staging":false,"production":false}},"auth":null,"pages":[{"id":"7f21e17b-ce85-4010-b215-ce0ffb3558cf","linkId":"7f21e17b-ce85-4010-b215-ce0ffb3558cf","name":"Article","folder":null,"paths":{"default":"p/{{slug|default}}"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"93dfe99a-111c-4eb8-bf92-b0f0263b90f8","sectionTitle":"Reuse Header Section","linkId":"ffe6c92e-1c75-4dea-a0cf-86286743921d"},{"uid":"3264fb5e-7f30-4279-b45a-d8d825d002a6","sectionTitle":"Article Content Section","linkId":"a0486054-8ceb-4bc9-bf0e-c97d437fe95e"},{"uid":"8e3c0cc8-fa4c-44ef-b4d7-6c326880b332","sectionTitle":"Reuse Footer Section","linkId":"8288eef1-065a-4459-bef8-b35ec0c77d30"},{"uid":"eb877f1c-0f3e-4c00-ae46-6ad95f269ee2","sectionTitle":"Fixed Sticky Bar Section","linkId":"76646bf8-3a72-42ce-bc01-2f1690e70a15"}],"pageUserGroups":[],"title":{"en":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},"meta":{"desc":{"en":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},"keywords":{"en":"whispering woods weddings, whispering woods events, whispering woods luxe, wedding guide, estate tips, lake geneva weddings, senior portraits"},"socialDesc":{"en":"Whispering Woods Journal editorial guide: wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL."},"socialTitle":{"en":"Whispering Woods Journal · Wedding & Estate Portrait Tips"},"structuredData":{"__schema_json_ld":"{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"BlogPosting\",\"headline\":\"Whispering Woods Journal Editorial Guide\",\"description\":\"Wedding planning tips, portrait styling, and private estate insights across 40 private acres in Harvard, IL.\",\"publisher\":{\"@type\":\"Organization\",\"name\":\"Whispering Woods Journal\",\"url\":\"https://whisperingwoodsweddings.com\",\"sameAs\":[\"https://whisperingwoodsevents.com\",\"https://whisperingwoodsluxe.com\"]},\"mainEntityOfPage\":{\"@type\":\"WebPage\",\"@id\":\"https://whisperingwoodsweddings.com\"}},{\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Journal\",\"item\":\"https://whisperingwoodsweddings.com\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Article Guide\"}]}]}"}},"metaImage":"","security":{}},{"id":"81e5d604-f110-4cc1-b384-b2728c3bd483","linkId":"81e5d604-f110-4cc1-b384-b2728c3bd483","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"93dfe99a-111c-4eb8-bf92-b0f0263b90f8","sectionTitle":"Reuse Header Section","linkId":"ffe6c92e-1c75-4dea-a0cf-86286743921d"},{"uid":"93dd3a4e-e7f8-4dfb-afbc-b10288003a63","sectionTitle":"Main Content Section","linkId":"bcfaba20-fb7e-43cc-af0d-d00b4c85a2c1"},{"uid":"8e3c0cc8-fa4c-44ef-b4d7-6c326880b332","sectionTitle":"Reuse Footer Section","linkId":"8288eef1-065a-4459-bef8-b35ec0c77d30"}],"pageUserGroups":[],"title":{"en":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},"meta":{"desc":{"en":"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},"keywords":{"en":"whispering woods journal, whispering woods weddings, whispering woods events, whispering woods luxe, harvard il wedding venue, lake geneva weddings, private estate buyout, outdoor wedding illinois, estate senior portraits, 40 private acres, three natural ponds, chalet wedding suite, outdoor ceremony tips"},"socialDesc":{"en":"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals."},"socialTitle":{"en":"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL"},"structuredData":{"__schema_json_ld":"{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebSite\",\"@id\":\"https://whisperingwoodsweddings.com/#website\",\"url\":\"https://whisperingwoodsweddings.com\",\"name\":\"Whispering Woods Journal\",\"description\":\"Editorial journal of the Whispering Woods estate: wedding planning tips, portrait styling, and grounds insights across 40 secluded acres in Harvard, IL.\",\"publisher\":{\"@id\":\"https://whisperingwoodsweddings.com/#organization\"},\"inLanguage\":\"en-US\"},{\"@type\":[\"EventVenue\",\"WeddingVenue\",\"Organization\"],\"@id\":\"https://whisperingwoodsweddings.com/#organization\",\"name\":\"Whispering Woods\",\"alternateName\":[\"Whispering Woods Weddings\",\"Whispering Woods Events\",\"Whispering Woods Luxe\",\"Whispering Woods Journal\"],\"url\":\"https://whisperingwoodsweddings.com\",\"sameAs\":[\"https://whisperingwoodsevents.com\",\"https://whisperingwoodsluxe.com\"],\"description\":\"Private 40-acre luxury estate in Harvard, Illinois offering full-weekend buyout weddings, private chalet suites, three natural ponds, and editorial senior photography south of Lake Geneva.\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Harvard\",\"addressRegion\":\"IL\",\"postalCode\":\"60033\",\"addressCountry\":\"US\"},\"areaServed\":[{\"@type\":\"AdministrativeArea\",\"name\":\"Lake Geneva Corridor\"},{\"@type\":\"AdministrativeArea\",\"name\":\"McHenry County, IL\"},{\"@type\":\"AdministrativeArea\",\"name\":\"Greater Chicago Area\"},{\"@type\":\"AdministrativeArea\",\"name\":\"Greater Milwaukee Area\"}],\"amenityFeature\":[{\"@type\":\"LocationFeatureSpecification\",\"name\":\"40 Private Acres\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Three Natural Ponds\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Private VIP Chalet\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Full-Weekend Buyout\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"One Wedding Per Weekend\",\"value\":true}]},{\"@type\":\"Blog\",\"@id\":\"https://whisperingwoodsweddings.com/#blog\",\"name\":\"Whispering Woods Journal\",\"url\":\"https://whisperingwoodsweddings.com\",\"description\":\"Field notes, season shifts, and quiet estate rituals from forty private acres in Harvard, Illinois.\",\"about\":[{\"@type\":\"Thing\",\"name\":\"Wedding Planning\"},{\"@type\":\"Thing\",\"name\":\"Estate Weddings\"},{\"@type\":\"Thing\",\"name\":\"Lake Geneva Wedding Venues\"},{\"@type\":\"Thing\",\"name\":\"Senior Portraits Class of 2027\"},{\"@type\":\"Thing\",\"name\":\"Private Grounds Photography\"}],\"publisher\":{\"@id\":\"https://whisperingwoodsweddings.com/#organization\"}},{\"@type\":\"WebPage\",\"@id\":\"https://whisperingwoodsweddings.com/#webpage\",\"url\":\"https://whisperingwoodsweddings.com\",\"name\":\"Whispering Woods Journal · Wedding & Estate Guides · Harvard, IL\",\"isPartOf\":{\"@id\":\"https://whisperingwoodsweddings.com/#website\"},\"about\":{\"@id\":\"https://whisperingwoodsweddings.com/#organization\"},\"description\":\"Field notes, wedding planning tips, and portrait styling across 40 private acres in Harvard, IL. Private weekend buyouts, natural ponds, and estate rituals.\",\"breadcrumb\":{\"@id\":\"https://whisperingwoodsweddings.com/#breadcrumb\"}},{\"@type\":\"BreadcrumbList\",\"@id\":\"https://whisperingwoodsweddings.com/#breadcrumb\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Whispering Woods\",\"item\":\"https://whisperingwoodsweddings.com\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Journal\",\"item\":\"https://whisperingwoodsweddings.com\"}]}]}"}},"metaImage":"","security":{}}],"plugins":[]};
window.wwg_cacheVersion = 7;
window.wwg_pluginsSettings = pluginsSettings;
window.wwg_disableManifest = true;

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
