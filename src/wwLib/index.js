import emitter from 'tiny-emitter/instance';
import services from './services/index.js';
import { useIconsStore } from '@/pinia/icons';

 /* wwFront:start */
// eslint-disable-next-line no-undef
;
/* wwFront:end */

import { computed, reactive } from 'vue';
import { useBackTableViewsStore } from '@/pinia/backTableViews.js';
import { useBackAuthStore } from '@/pinia/backAuth.js';
import { getRuntimeEnvironment } from '@/helpers/frontEnv.js';
import { useEnvVariablesStore } from '@/pinia/envVariables.js';
import { createEnvironmentVariablesContext } from './services/environmentVariables';

let runtimeActivationError;

export default {
    ...services,
     $on(event, fn) {
        emitter.on(event, fn);
    },
    $once(event, fn) {
        emitter.once(event, fn);
    },
    $emit(event, ...args) {
        if (!event) {
            return;
        }
        emitter.emit(event, ...args);
    },
    $off(event, fn) {
        emitter.off(event, fn);
    },
     front: {},
    $focus: null,
    env: process.env.NODE_ENV,
    runtimeActivated: false,
    async initFront({ router, store, staticRendering = false }) {
 
        this.front.router = router;
        /* wwFront:start */
        this.$store = store;
        /* wwFront:end */

        //Init services
        this.wwLog.init();

 
        await this.wwWebsiteData.init();
        this.wwLang.init(router);

        /* wwFront:start */
        // eslint-disable-next-line no-undef
        ;
        /* wwFront:end */

 
        if (!staticRendering) this.activateRuntime();
    },
    activateRuntime() {
        if (this.runtimeActivated) return;
        if (runtimeActivationError) throw runtimeActivationError;

        try {
            void this.wwPluginHelper.activatePlugins();
            services.scrollStore.start();
            services.keyboardEventStore.start();
            services.pwaStore.start();
            this.runtimeActivated = true;
        } catch (error) {
            runtimeActivationError = error;
            throw error;
        }
    },
     // TODO: Verify with Alexis, still uses wwImageMultiLang
    getResponsiveStyleProp({ store, style, uid, states = [], prop }) {
        store = store || wwLib.getFrontWindow().wwLib.$store;
        if (!style && uid) {
            const wwObject = this.$store.getters['websiteData/getWwObjects'][uid];
            if (!wwObject) return '';
            style = (wwObject._state || {}).style || {};
        }

        const screenSizes = store.getters['front/getScreenSizes'];
        const screenSize = store.getters['front/getScreenSize'];

        let value = '';

        for (const media in screenSizes) {
            if (style[media] && typeof style[media][prop] !== 'undefined') {
                value = style[media][prop];
            }
            if (media === screenSize) {
                break;
            }
        }
        for (const state of states) {
            for (const media in screenSizes) {
                if (style[`${state}_${media}`] && style[`${state}_${media}`][prop]) {
                    value = style[`${state}_${media}`][prop];
                }
                if (media === screenSize) {
                    break;
                }
            }
        }

        return value;
    },
    globalContext: reactive({
        auth: computed(() => {
            const backAuthStore = useBackAuthStore(wwLib.$pinia);
            return {
                user: backAuthStore.user,
                session: backAuthStore.session,
                isAuthenticated: backAuthStore.isAuthenticated,
            };
        }),
        env: computed(() => {
            const envVariablesStore = useEnvVariablesStore(wwLib.$pinia);
            let env = wwLib.getEnvironment();
            if (env === 'preview') env = 'production';
            return createEnvironmentVariablesContext(Object.values(envVariablesStore.values), env);
        }),
        tableViews: computed(() => {
            const backTableViewsStore = useBackTableViewsStore(wwLib.$pinia);
            return backTableViewsStore?.data;
        }),
        page: computed(() => {
            const page = wwLib.$store.getters['websiteData/getPage'];
            if (!page) return {};
            else if (!page.cmsDataSetPath) return { ...pageSanitizer(page) };
            return { ...pageSanitizer(page), data: wwLib.$store.getters['data/getPageCollectionData'] };
        }),
        pageParameters: computed(() => {
            const pageParameters = Object.values(wwLib.$store.getters['data/getPageParameterVariables']);
            const pageParametersValueMap = {};
            for (const pageParameter of pageParameters) pageParametersValueMap[pageParameter.id] = pageParameter.value;
            return pageParametersValueMap;
        }),
        pages: computed(() => {
            const pages = wwLib.$store.getters['websiteData/getPages'];
            const pagesValueMap = {};
            for (const page of pages) pagesValueMap[page.id] = pageSanitizer(page);
            return pagesValueMap;
        }),
        colors: computed(() => {
            const theme = wwLib.$store.getters['front/getTheme'];
             /* wwFront:start */
            // eslint-disable-next-line no-unreachable, no-undef
            return theme === 'dark' ? {"315b05a1-d2af-4851-983b-8d4ddf8a52e7":"#FAF6F0","c1c56595-ac2d-4b23-b6f0-9b7cf00eba61":"#141F19","db6d4bee-90d7-4881-b22d-8508b1aebb60":"#C6A15B","0c5a7c76-85fc-45c1-834b-efb389531afe":"rgba(30, 45, 36, 0.62)","f295952a-64f5-44fa-b479-b6d5dded0491":"#F9F6F0","42bfba74-51e0-423f-a331-321dcf7b239d":"#C49A5A","19f0000b-adbe-421b-bee3-42fff536a9ad":"rgba(30, 45, 36, 0.1)","64598b93-2ca3-4422-8f2a-a13bd10bda1c":"#1E2D24","9f36b9b1-179d-47e1-acff-e047404f7edb":"#7B8E7A","f1e2372f-d217-490a-bdd6-a427ffb13a3a":"rgba(30, 45, 36, 0.08)"} : {"315b05a1-d2af-4851-983b-8d4ddf8a52e7":"#FAF6F0","c1c56595-ac2d-4b23-b6f0-9b7cf00eba61":"#141F19","db6d4bee-90d7-4881-b22d-8508b1aebb60":"#C6A15B","0c5a7c76-85fc-45c1-834b-efb389531afe":"rgba(44, 44, 44, 0.62)","f295952a-64f5-44fa-b479-b6d5dded0491":"#F9F6F0","42bfba74-51e0-423f-a331-321dcf7b239d":"#C49A5A","19f0000b-adbe-421b-bee3-42fff536a9ad":"rgba(44, 44, 44, 0.1)","64598b93-2ca3-4422-8f2a-a13bd10bda1c":"#1E2D24","9f36b9b1-179d-47e1-acff-e047404f7edb":"#7B8E7A","f1e2372f-d217-490a-bdd6-a427ffb13a3a":"rgba(30, 45, 36, 0.08)"};
            /* wwFront:end */
        }),
        spacings:
         /* wwFront:start */
        // eslint-disable-next-line no-unreachable, no-undef
        {"522b3039-a81d-4500-9141-6901f549b0f3":"16px","e660e90a-6acb-4391-9a33-2333fcbf9da5":"48px","54010d61-5aa2-403c-987f-f65bebd985b2":"96px","28dd7d03-2c48-42c7-bd4a-80d2f1b912f8":"18px","b5442e00-3090-4a9a-b608-6f72e57dacc8":"999px","3d789f4c-7e3e-4fac-a298-c1961f664a13":"680px","e6e6b4a1-7a93-45a6-9cf3-67ca92762197":"8px","92a5181f-b800-4da7-964e-7e4dd0f9bf3f":"32px","191386d8-85a4-4d9d-b64f-2167a4e02f87":"24px","62b589c4-b368-445d-8627-bac0c7e16cfb":"64px","da0c255e-80aa-4a5a-8073-281446d5c8a9":"12px","b709145f-c4df-41ee-ab74-7c95248a7dc5":"960px"},
        /* wwFront:end */
        typographies:
         /* wwFront:start */
        // eslint-disable-next-line no-unreachable, no-undef
        {"4c078281-724b-40b6-9c4f-86891eff5189":"500 22px/1.1 var(--ww-default-font-family, 'Cormorant Garamond', serif)","7d3ea5d0-2141-479e-9ff9-58f70b8c05e2":"600 2.25rem/1.15 var(--ww-default-font-family, 'Cormorant Garamond', serif)","7d2ed228-cc51-4378-bbf9-bc596fa57f0d":"600 12px/1.4 var(--ww-default-font-family, Montserrat, sans-serif)","ca5885a8-1914-407c-a64f-d0ec46b6261c":"600 1.5rem/1.25 var(--ww-default-font-family, 'Cormorant Garamond', serif)","5ab70d04-9f2d-4a56-b0ee-a6fd8e3b6616":"400 17px/1.55 var(--ww-default-font-family, Inter, sans-serif)","829f2414-4ae4-41e5-a728-8355d6b79f35":"600 36px/1.2 var(--ww-default-font-family, 'Cormorant Garamond', serif)","1c471909-adca-4c1b-8140-637c0cecbfa9":"600 36px/1.15 var(--ww-default-font-family, 'Cormorant Garamond', serif)","e54744e5-aa6c-4799-99ab-02ee659954b1":"600 24px/1.25 var(--ww-default-font-family, 'Cormorant Garamond', serif)","09c583f8-cc77-4851-b51d-e71f089b148a":"600 11px/1.4 var(--ww-default-font-family, Montserrat, sans-serif)","acaa469b-4bd7-4bc3-b98b-b639022c9f56":"500 13px/1.4 var(--ww-default-font-family, Inter, sans-serif)"},
        /* wwFront:end */
        browser: computed(() => {
            const router = wwLib.manager ? wwLib.getEditorRouter() : wwLib.getFrontRouter();
            const currentRoute = router.currentRoute.value;
            let currentQueries = currentRoute.query;
             return {
                url: window.location.origin + currentRoute.fullPath,
                path: currentRoute.path,
                // verify if auth plugin
                 /* wwFront:start */
                // eslint-disable-next-line no-dupe-keys
                source: currentQueries._source,
                /* wwFront:end */
                query: currentQueries,
                domain: window.location.hostname,
                baseUrl: window.location.origin,
                breakpoint: wwLib.$store.getters['front/getScreenSize'],
                environment: wwLib.getEnvironment(),
                theme: wwLib.$store.getters['front/getTheme'],
            };
        }),
        pwa: services.pwaStore.pwa,
        screen: services.scrollStore.screen,
        componentPositionInfo: services.scrollStore.componentPositionInfo,
    }),

    pageData: computed(() => {
        const lang = wwLib.$store.getters['front/getLang'];
        const cmsDataSetPath = wwLib.$store.getters['websiteData/getPage'].cmsDataSetPath;
        if (!cmsDataSetPath) {
            return { lang };
        }

        return { lang, data: wwLib.$store.getters['data/getPageCollectionData'] };
    }),

    getEnvironment() {
        return getRuntimeEnvironment();
    },

    useBaseTag() {
        return (
            wwLib.getEnvironment() === 'production' &&
            window.wwg_designInfo.baseTag &&
            window.wwg_designInfo.baseTag.href
        );
    },

    getBaseTag() {
        let baseTag = window.wwg_designInfo.baseTag?.href || '';
        if (!baseTag.startsWith('/')) {
            baseTag = '/' + baseTag;
        }
        if (!baseTag.endsWith('/')) {
            baseTag += '/';
        }
        return baseTag;
    },

    /**
     * @PUBLIC_API
     */
    getFrontWindow() {
        if (document.querySelector('.ww-manager-iframe')) {
            return document.querySelector('.ww-manager-iframe').contentWindow;
        }
        return window;
    },

    /**
     * @PUBLIC_API
     */
    getFrontDocument() {
        return this.getFrontWindow().document;
    },

    /**
     * @PUBLIC_API
     */
    getFrontRouter() {
        return this.front.router;
    },

    /**
     * @PUBLIC_API
     */
    getEditorWindow() {
         // eslint-disable-next-line no-unreachable
        return null;
    },

    /**
     * @PUBLIC_API
     */
    getEditorDocument() {
         // eslint-disable-next-line no-unreachable
        return null;
    },

    /**
     * @PUBLIC_API
     */
    getEditorRouter() {
        return this.editor.router;
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwApp.goTo
     */
    goTo(...args) {
        wwLib.wwLog.warn('wwLib.goTo is DEPRECATED, use wwLib.wwApp.goTo instead');
        wwLib.wwApp.goTo(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.getStyleFromToken
     */
    getStyleFromToken(...args) {
        // wwLib.wwLog.warn('wwLib.getStyleFromToken is DEPRECATED, use wwLib.wwUtils.getStyleFromToken instead');
        return wwLib.wwUtils.getStyleFromToken(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.getTypoFromToken
     */
    getTypoFromToken(...args) {
        // wwLib.wwLog.warn('wwLib.getTypoFromToken is DEPRECATED, use wwLib.wwUtils.getTypoFromToken instead');
        return wwLib.wwUtils.getTypoFromToken(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED
     */
    element(value) {
        wwLib.wwLog.warn('wwLib.element is DEPRECATED');
        if (typeof value === 'object') {
            return { isWwObject: true, ...value };
        } else {
            return { isWwObject: true, type: value };
        }
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwUtils.resolveObjectPropertyPath
     */
    resolveObjectPropertyPath(...args) {
        // wwLib.wwLog.warn(
        //     'wwLib.resolveObjectPropertyPath is DEPRECATED, use wwLib.wwUtils.resolveObjectPropertyPath instead'
        // );
        return wwLib.wwUtils.resolveObjectPropertyPath(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwWorkflow.executeGlobal
     */
    async executeWorkflow(...args) {
        wwLib.wwLog.warn('wwLib.executeWorkflow is DEPRECATED, use wwLib.wwWorkflow.executeGlobal instead');
        return wwLib.wwWorkflow.executeGlobal(...args);
    },

    /**
     * @PUBLIC_API
     * @EDITOR
     * @DEPRECATED wwLib.wwEditor.findParentUidByFlag
     */
    findParentUidByFlag(...args) {
        wwLib.wwLog.warn('wwLib.wwEditor.findParentUidByFlag is DEPRECATED, use wwLib.findParentUidByFlag instead');
        return wwLib.wwEditor.findParentUidByFlag(...args);
    },

    /**
     * @PUBLIC_API
     * @EDITOR
     * @DEPRECATED wwLib.wwEditor.selectParentByFlag
     */
    selectParentByFlag(...args) {
        wwLib.wwLog.warn('wwLib.wwEditor.selectParentByFlag is DEPRECATED, use wwLib.selectParentByFlag instead');
        return wwLib.wwEditor.selectParentByFlag(...args);
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwElement.useCreate
     */
    useCreateElement() {
        wwLib.wwLog.warn('wwLib.useCreateElement is DEPRECATED, use wwLib.wwElement.useCreate instead');
        return this.wwElement.useCreate();
    },

    /**
     * @PUBLIC_API
     * @DEPRECATED wwLib.wwElement.useLayoutStyle
     */
    useLayoutStyle() {
        wwLib.wwLog.warn('wwLib.useLayoutStyle is DEPRECATED, use wwLib.wwElement.useLayoutStyle instead');
        return wwLib.wwElement.useLayoutStyle();
    },

    /**
     * @PUBLIC_API
     */
    useIcons() {
        const store = useIconsStore();
        return {
            getIcon: store.getIcon,
        };
    },
};

function pageSanitizer(page) {
    const keysToInclude = [
        'id',
        'name',
        'folder',
        'metaImage',
        'pageLoaded',
        'paths',
        'langs',
        'meta',
        'title',
        'sections',
        'pageUserGroups',
    ];

    const _page = {};
    keysToInclude.forEach(key => {
        _page[key] = page[key];
    });

    _page.meta && delete _page.meta.__typename;
    for (const section of _page.sections || []) {
        delete section.__typename;
    }

    const lang = wwLib.$store.getters['front/getLang'];
    if (_page.paths) _page.path = _page.paths[lang] || _page.paths.default;
    else _page.path = null;

    _page.lang = lang;

    return _page;
}
