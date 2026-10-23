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

window.wwg_designInfo = {"id":"cbd9a95f-c61e-441a-87cb-b25006511440","homePageId":"385ba910-fe19-436b-a205-edc2ec8b88a7","authPluginId":null,"baseTag":null,"defaultTheme":"light","langs":[{"lang":"en","default":true}],"background":{},"workflows":[{"id":"a8f3c2e1-9b4d-4a6e-8f7c-1d2e3b4a5c6d","name":"WW Site Boot","folder":null,"actions":{"__WW_BOOT__":{"id":"__WW_BOOT__","code":"const SEASON_VAR = '6e7f5084-d32d-4fb7-98bd-1337a99fc5fb';\nconst GALLERY_SEASON_VAR = '301d0edc-0a02-47eb-85e2-aad3a5ecec04';\nconst VALID = { spring: 1, summer: 1, autumn: 1 };\nconst TAB_SEASON = {\n  '8b68b655-aefa-4e90-aedd-9da03fa83f04': 'spring',\n  '71f57801-4f90-4b3e-983a-9b266f6de9a2': 'summer',\n  'acf6e8c7-9f3a-41c7-b491-7123eded81db': 'autumn',\n};\nconst PALETTE = {\n  spring: { accent: '#8a9a86', deep: '#1a2b22' },\n  summer: { accent: '#c49a5a', deep: '#1e2d24' },\n  autumn: { accent: '#b86b32', deep: '#241a14' },\n};\nconst DREAM = {\n  spring: 'Begin where the woods meet the aisle.',\n  summer: 'Long light on the ponds — the whole weekend ahead.',\n  autumn: 'Gold on forty acres, still only yours.',\n};\nconst DEFAULT_POETRY =\n  'Forty acres of private woods on a 40-acre estate — yours for the weekend.';\nconst TOUR_URL = 'https://calendly.com/whisperingwoodsinfo/private-venue-tour';\nconst PROD = 'https://www.whisperingwoodsevents.com';\nconst doc = wwLib.getFrontDocument();\nconst root = doc.documentElement;\nconst win = doc.defaultView;\n\nif (doc.body) {\n  doc.body.style.paddingBottom = 'calc(76px + env(safe-area-inset-bottom, 0px))';\n  doc.body.style.webkitTapHighlightColor = 'transparent';\n  doc.body.classList.add('ww-site');\n}\n\nif (!win.WW_SITE_CONFIG) {\n  win.WW_SITE_CONFIG = {\n    tour_booking_url: TOUR_URL,\n    active_season_var: SEASON_VAR,\n    email: 'info@whisperingwoodsevents.com',\n  };\n}\n\nfunction assetBase() {\n  const host = win.location.hostname || '';\n  if (host.indexOf('whisperingwoodsevents.com') !== -1) return '';\n  if (host.indexOf('weweb.io') !== -1 || host.indexOf('vercel.app') !== -1)\n    return win.location.origin;\n  return PROD;\n}\n\nfunction loadTourAssets() {\n  const base = assetBase();\n  if (!doc.querySelector('link[data-ww-tour-css]')) {\n    const link = doc.createElement('link');\n    link.rel = 'stylesheet';\n    link.href = base + '/ww-tour-modal.css';\n    link.dataset.wwTourCss = '1';\n    doc.head.appendChild(link);\n  }\n  function loadScript(src, done) {\n    if (doc.querySelector('script[data-src=\"' + src + '\"]')) {\n      done && done();\n      return;\n    }\n    const s = doc.createElement('script');\n    s.src = src;\n    s.dataset.src = src;\n    s.onload = function () { done && done(); };\n    doc.head.appendChild(s);\n  }\n  loadScript(base + '/ww-tour-modal.js', function () {\n    loadScript(base + '/ww-site-bridge.js');\n  });\n}\nloadTourAssets();\n\nfunction openTourDrawer(ev) {\n  if (ev) { ev.preventDefault(); ev.stopPropagation(); }\n  if (typeof win.wwOpenTourModal === 'function') { win.wwOpenTourModal(); return; }\n  loadTourAssets();\n  win.dispatchEvent(new CustomEvent('ww:open-tour-request'));\n  let tries = 0;\n  const retry = function () {\n    tries += 1;\n    if (typeof win.wwOpenTourModal === 'function') { win.wwOpenTourModal(); return; }\n    if (tries < 16) win.setTimeout(retry, 150);\n  };\n  retry();\n}\n\nif (!root.dataset.wwTourCapture) {\n  root.dataset.wwTourCapture = '1';\n  doc.addEventListener('click', function (ev) {\n    const el = ev.target.closest('a, button, [role=\"button\"]');\n    if (!el) return;\n    const href = (el.getAttribute('href') || '').toLowerCase();\n    const text = (el.textContent || '').trim();\n    if (href.indexOf('calendly.com') === -1 && !/tour the grounds|^tour$/i.test(text)) return;\n    if (el.closest('#ww-sticky-nav') && !el.closest('#ww-sticky-nav.is-expanded')) return;\n    openTourDrawer(ev);\n  }, true);\n}\n\nif (!doc.getElementById('ww-kill-scroll-anim')) {\n  const st = doc.createElement('style');\n  st.id = 'ww-kill-scroll-anim';\n  st.textContent = 'html.ww-site [id^=\"scroll-\"] { animation: none !important; opacity: 1 !important; transform: none !important; }';\n  doc.head.appendChild(st);\n}\n\nfunction poetryEl() {\n  return doc.querySelector('#ww-dreamline') || doc.querySelector('.ww-element-cd1c365d-76ee-4806-824d-ebef5f137aee');\n}\nfunction updatePoetry(season) {\n  const el = poetryEl();\n  if (!el) return;\n  const line = season && DREAM[season] ? DREAM[season] : DEFAULT_POETRY;\n  if (el.textContent !== line) el.textContent = line;\n}\nfunction syncGalleryFilter(season) {\n  const val = season || 'all';\n  try {\n    if (wwLib.wwVariable && typeof wwLib.wwVariable.updateValue === 'function') {\n      wwLib.wwVariable.updateValue(GALLERY_SEASON_VAR, val);\n    }\n  } catch (e) {}\n}\nfunction paintSeasonTokens(season) {\n  const tokenKeys = ['--ww-accent','--ww-section-deep','--ww-gold','--c0c11ce2-c659-4b11-951e-ba8bf27c74cc','--def92927-84a9-422e-bdae-62d522cc2e42','--a5dd128b-549f-4f54-9c83-114918bbf26e'];\n  if (!season || !PALETTE[season]) { tokenKeys.forEach(function (k) { root.style.removeProperty(k); }); return; }\n  const p = PALETTE[season];\n  root.style.setProperty('--ww-accent', p.accent);\n  root.style.setProperty('--ww-section-deep', p.deep);\n  root.style.setProperty('--ww-gold', p.accent);\n  root.style.setProperty('--c0c11ce2-c659-4b11-951e-ba8bf27c74cc', p.accent);\n  root.style.setProperty('--def92927-84a9-422e-bdae-62d522cc2e42', p.deep);\n  root.style.setProperty('--a5dd128b-549f-4f54-9c83-114918bbf26e', p.deep);\n}\nfunction applySeason(val) {\n  const season = val && VALID[val] ? val : '';\n  root.setAttribute('data-season', season);\n  if (doc.body) doc.body.setAttribute('data-season', season);\n  paintSeasonTokens(season);\n  if (typeof win.wwSetSeason === 'function') win.wwSetSeason(season, { silent: true, skipDream: true, force: true });\n  updatePoetry(season);\n  syncGalleryFilter(season);\n}\nfunction readSeason() {\n  let saw = false; let v;\n  try {\n    if (wwLib.wwVariable && typeof wwLib.wwVariable.getValue === 'function') { v = wwLib.wwVariable.getValue(SEASON_VAR); saw = true; }\n  } catch (e) {}\n  if (!saw) return null;\n  if (v === '' || v === null || v === undefined) return '';\n  return VALID[v] ? v : '';\n}\nlet last = null;\nfunction tickSeason() {\n  const next = readSeason();\n  if (next === null) return;\n  if (next !== last) { last = next; applySeason(next); }\n}\ntickSeason();\nwin.setInterval(tickSeason, 200);\nif (!root.dataset.wwSeasonTabBridge) {\n  root.dataset.wwSeasonTabBridge = '1';\n  doc.addEventListener('click', function (ev) {\n    let seasonKey = null;\n    for (const uid in TAB_SEASON) {\n      if (ev.target.closest('.ww-element-' + uid)) { seasonKey = TAB_SEASON[uid]; break; }\n    }\n    if (!seasonKey) return;\n    const before = root.getAttribute('data-season') || '';\n    const toggled = before === seasonKey ? '' : seasonKey;\n    win.setTimeout(function () {\n      const fromVar = readSeason();\n      let next;\n      if (fromVar === null) next = toggled;\n      else if (fromVar === before) next = toggled;\n      else next = fromVar;\n      if (next !== last) { last = next; applySeason(next); }\n    }, 80);\n  }, true);\n}\nreturn true;","name":"WW site boot","next":null,"type":"custom-js","__wwdescription":"activeGallerySeason UUID fixed (301d0edc…aad3a5ecec04)"}},"trigger":"onload-app","description":"Season var → data-season + inline tokens, tab-click stale getValue fix, tour drawer.","firstAction":"__WW_BOOT__"},{"id":"b7e2c1f0-4a3d-4b5c-9e8f-7d6c5b4a3f2e","name":"WW Tour Drawer Loader","folder":null,"actions":{"__WW_LOAD_TOUR__":{"id":"__WW_LOAD_TOUR__","code":"const doc = wwLib.getFrontDocument();\nconst win = doc.defaultView;\nif (!win) return false;\nif (typeof win.wwOpenTourModal === \"function\") return true;\nif (!doc.getElementById(\"ww-tour-modal-css\")) {\n  const st = doc.createElement(\"style\");\n  st.id = \"ww-tour-modal-css\";\n  st.textContent = \".ww-tour-root{position:fixed;inset:0;z-index:10050;pointer-events:none;visibility:hidden}\\n.ww-tour-root.is-open{pointer-events:auto;visibility:visible}\\n.ww-tour-backdrop{position:absolute;inset:0;background:rgba(20,31,25,.62);opacity:0;transition:opacity .35s}\\n.ww-tour-root.is-open .ww-tour-backdrop{opacity:1}\\n.ww-tour-sheet{position:absolute;top:0;right:0;bottom:0;width:min(100%,440px);background:#141f19;color:#f9f6f0;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .42s}\\n.ww-tour-root.is-open .ww-tour-sheet{transform:translateX(0)}\\n.ww-tour-frame{flex:1;min-height:420px}\\n.ww-tour-frame iframe{width:100%;height:100%;min-height:420px;border:0}\\nhtml.ww-tour-open{overflow:hidden}\\n@media(max-width:640px){.ww-tour-sheet{left:0;right:0;top:auto;width:100%;max-height:94vh;transform:translateY(100%)}.ww-tour-root.is-open .ww-tour-sheet{transform:translateY(0)}}\";\n  doc.head.appendChild(st);\n}\nif (!doc.getElementById(\"ww-tour-modal-js\")) {\n  const s = doc.createElement(\"script\");\n  s.id = \"ww-tour-modal-js\";\n  s.textContent = \"(function(){var cfg=window.WW_SITE_CONFIG||{};var BASE=cfg.tour_booking_url||'https://calendly.com/whisperingwoodsinfo/private-venue-tour';var EMBED=BASE+(BASE.indexOf('?')===-1?'?':'&')+'hide_gdpr_banner=1&background_color=141f19&text_color=f9f6f0&primary_color=c49a5a';var root,lastFocus;function build(){if(root)return root;root=document.createElement('div');root.className='ww-tour-root';root.id='ww-tour-modal';root.hidden=true;root.innerHTML='<div class=\\\"ww-tour-backdrop\\\" data-ww-tour-close></div><div class=\\\"ww-tour-sheet\\\"><button type=\\\"button\\\" class=\\\"ww-tour-close\\\" data-ww-tour-close aria-label=\\\"Close\\\">×</button><div class=\\\"ww-tour-frame\\\"><iframe title=\\\"Tour\\\" data-ww-tour-iframe></iframe></div></div>';document.body.appendChild(root);root.addEventListener('click',function(ev){if(ev.target.closest('[data-ww-tour-close]'))close();});return root;}function open(){var el=build();var iframe=el.querySelector('[data-ww-tour-iframe]');if(iframe&&!iframe.getAttribute('src'))iframe.setAttribute('src',EMBED);lastFocus=document.activeElement;el.hidden=false;requestAnimationFrame(function(){el.classList.add('is-open');});document.documentElement.classList.add('ww-tour-open');document.body.style.overflow='hidden';}function close(){if(!root)return;root.classList.remove('is-open');document.documentElement.classList.remove('ww-tour-open');document.body.style.overflow='';setTimeout(function(){if(!root.classList.contains('is-open'))root.hidden=true;},400);if(lastFocus&&lastFocus.focus)lastFocus.focus();}window.wwOpenTourModal=open;window.wwCloseTourModal=close;window.addEventListener('ww:open-tour-request',open);})();\";\n  doc.head.appendChild(s);\n}\nreturn typeof win.wwOpenTourModal === \"function\";","name":"Inline tour modal","next":null,"type":"custom-js","__wwdescription":"Inject ww-tour-modal CSS and JS into the document"}},"trigger":"onload-app","description":"Inlines tour modal CSS+JS on app load so WeWeb preview works without /public URLs.","firstAction":"__WW_LOAD_TOUR__"}],"back":{"isServerSetup":{"staging":false,"production":false}},"auth":null,"pages":[{"id":"061de62d-94a9-476c-8acf-696c53e1adfd","linkId":"061de62d-94a9-476c-8acf-696c53e1adfd","name":"Contact","folder":null,"paths":{"en":"contact","default":"contact"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"b1a39da1-7535-42b1-b777-879a46b79b94","sectionTitle":"Contact Hero","linkId":"7fb0dc33-1f1c-492c-820d-297db57f50de"},{"uid":"f24dc13a-0dfc-4e71-9221-a07cffbe6ab7","sectionTitle":"Map Section","linkId":"a4eb5776-2cfb-4bd7-90b2-2faffb576373"},{"uid":"8b2a0955-5cc3-4618-af4a-fdfbbf4265de","sectionTitle":"Footer Section","linkId":"f1833ffd-79f9-4ab5-850b-f4e79e0a96ef"}],"pageUserGroups":[],"title":{"en":"Large Capacity Forest Wedding Secluded Estate | Contact · Harvard IL"},"meta":{"desc":{"en":"Large Capacity Forest Wedding Secluded Estate — tour the grounds, verified map location, Private Forest Wedding Venue Chicago Milwaukee corridor. Harvard, Illinois 60033."},"keywords":{"en":"Large Capacity Forest Wedding Secluded Estate, Private Forest Wedding Venue Chicago Milwaukee, Whispering Woods Events Harvard IL, engagement photos Harvard IL, estate engagement session Lake Geneva, engagement pictures private estate Illinois"},"socialDesc":{"en":"Contact · map · private forest estate south of Lake Geneva."},"socialTitle":{"en":"Contact · Large Capacity Forest Wedding Secluded Estate"},"structuredData":{"__schema_json_ld":"{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebPage\",\"@id\":\"https://www.whisperingwoodsevents.com/contact#webpage\",\"url\":\"https://www.whisperingwoodsevents.com/contact\",\"name\":\"Contact and Directions\",\"description\":\"Tour the grounds by appointment. Harvard, Illinois 60033, south of Lake Geneva.\",\"about\":{\"@id\":\"https://www.whisperingwoodsevents.com/#venue\"}},{\"@type\":[\"EventVenue\",\"LocalBusiness\"],\"@id\":\"https://www.whisperingwoodsevents.com/#venue\",\"name\":\"Whispering Woods Events\",\"url\":\"https://www.whisperingwoodsevents.com\",\"email\":\"info@whisperingwoodsevents.com\",\"priceRange\":\"$$$\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Harvard\",\"addressRegion\":\"IL\",\"postalCode\":\"60033\",\"addressCountry\":\"US\"}}]}"}},"metaImage":"images/Megan%26CollinWhisperingWoodsWedding-3235-compressed_Webpifier.webp?_wwcv=38","security":{}},{"id":"78bda3b0-10da-46db-9c0a-16d8fa0b330f","linkId":"78bda3b0-10da-46db-9c0a-16d8fa0b330f","name":"Integrity & Solar","folder":null,"paths":{"en":"integrity","default":"integrity"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"3ed565b3-f454-4f28-9da5-1ed9e96d107e","sectionTitle":"Eco Hero","linkId":"40440627-11f6-4acc-a678-f579f7104e55"},{"uid":"89f8eaee-aa9c-4a88-a017-b2ea8d6e9aec","sectionTitle":"Eco Cycle","linkId":"ff90df56-a7fd-4b24-a026-93c098851cdb"},{"uid":"9950e463-625d-42af-808d-6d1d60bfc4f6","sectionTitle":"Eco CTA","linkId":"e222c744-a0d7-490f-820f-5030a6d105f1"},{"uid":"8b2a0955-5cc3-4618-af4a-fdfbbf4265de","sectionTitle":"Footer Section","linkId":"f1833ffd-79f9-4ab5-850b-f4e79e0a96ef"}],"pageUserGroups":[],"title":{"en":"Eco-Friendly Solar Powered Wedding Venue Illinois | Integrity & Solar"},"meta":{"desc":{"en":"Eco-Friendly Solar Powered Wedding Venue Illinois — on-site solar, regenerative waste, and floral legacy on a secluded forest estate south of Lake Geneva."},"keywords":{"en":"Eco-Friendly Solar Powered Wedding Venue Illinois, Solar-Powered Wedding Venue Illinois"},"socialDesc":{"en":"Eco-Friendly Solar Powered Wedding Venue Illinois — stewardship woven into the weekend."},"socialTitle":{"en":"Eco-Friendly Solar Powered Wedding Venue Illinois"},"structuredData":{"__schema_json_ld":"{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebPage\",\"@id\":\"https://www.whisperingwoodsevents.com/integrity#webpage\",\"url\":\"https://www.whisperingwoodsevents.com/integrity\",\"name\":\"Integrity and Solar\",\"description\":\"Solar-powered forest wedding venue in Illinois with regenerative waste and floral legacy programs.\",\"about\":{\"@id\":\"https://www.whisperingwoodsevents.com/#venue\"}},{\"@type\":[\"EventVenue\",\"LocalBusiness\"],\"@id\":\"https://www.whisperingwoodsevents.com/#venue\",\"name\":\"Whispering Woods Events\",\"url\":\"https://www.whisperingwoodsevents.com\",\"description\":\"100% on-site solar power for weekend estate buyouts.\",\"priceRange\":\"$$$\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Harvard\",\"addressRegion\":\"IL\",\"postalCode\":\"60033\",\"addressCountry\":\"US\"},\"additionalProperty\":[{\"@type\":\"PropertyValue\",\"name\":\"Solar powered\",\"value\":\"true\"}]}]}"}},"metaImage":"images/Megan%26CollinWhisperingWoodsWedding-3235-compressed_Webpifier.webp?_wwcv=38","security":{}},{"id":"385ba910-fe19-436b-a205-edc2ec8b88a7","linkId":"385ba910-fe19-436b-a205-edc2ec8b88a7","name":"Home","folder":null,"paths":{"en":"home","default":"home"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"df7f8a87-19ea-4212-89fb-6d93eae3e95a","sectionTitle":"Hero Section","linkId":"5b1c263b-e701-4a7e-805e-6c90d0402810"},{"uid":"9ece84a0-a34a-4657-aa3a-3afa536e51da","sectionTitle":"The Feeling Section","linkId":"09990f33-288c-4dbf-af15-432b88a121a2"},{"uid":"0fa8e840-5ee8-4ad3-888b-daf5de17be40","sectionTitle":"Seasonal Switcher Section","linkId":"885f4316-4ea2-4c0b-8360-9782df2a089c"},{"uid":"6aac15af-e553-4ae4-bced-c6b9d4b69f10","sectionTitle":"The Pillars Section","linkId":"5846ae2c-af5e-4023-8015-451a439f073e"},{"uid":"8a362171-525f-4771-9be2-524b588c87c6","sectionTitle":"Calm Is Part of the Buyout Section","linkId":"24e077f6-bf56-472c-9328-52cdbec99d54"},{"uid":"e0180506-7fc7-49da-bcfc-bd4f19ba8341","sectionTitle":"The Numbers Section","linkId":"427ea354-461f-47c7-947a-6ac75ed76754"},{"uid":"b0d690b3-3c7a-4c14-b874-77ee684b4d1e","sectionTitle":"Quote Strip Section","linkId":"56a6846d-8379-4200-b02b-26462265c2c4"},{"uid":"6ffe3ddd-a051-4548-8a91-ce05ac0752fd","sectionTitle":"Sticky Bottom Navigation","linkId":"8c92458e-8dc4-4988-a12e-fb43a45cb42a"},{"uid":"ec91c45b-cb19-4dd8-9f05-3eb473921d3a","sectionTitle":"The Venue Preview Section","linkId":"b41c6326-21cc-4de2-a8a4-f9842cdbc2d3"},{"uid":"76ad3dc9-eaa5-4641-8b29-c230fa43d5a9","sectionTitle":"Walk the Property Hotspots Section","linkId":"a44bc476-d97c-49c2-94ec-e06b7ff4d14a"},{"uid":"6844cb80-5b41-4f14-b5f4-c22b51c7060f","sectionTitle":"The Weekend Section","linkId":"519a913f-f23d-43b3-8748-4929894d60f0"},{"uid":"a395f30d-7a24-4d09-8871-e799e7c30ded","sectionTitle":"The Barn Section","linkId":"32b2de1a-3ddb-451f-999b-b22b06a886ba"},{"uid":"16045199-a1ca-489a-a009-7de0fcb5f3cd","sectionTitle":"The Chalet Section","linkId":"71fdcf59-43d9-481f-9774-f876e08f3074"},{"uid":"7119ad45-3954-4506-8d3a-243386408196","sectionTitle":"Destination Feel. Easy Arrival Section","linkId":"181955d4-f414-4537-849d-716a9e34c139"},{"uid":"23d31381-69a9-40ad-adbf-cfda65b2799a","sectionTitle":"Built Forward Section","linkId":"2b1d6e2a-6b7a-4d66-b8eb-80bb2f12be96"},{"uid":"7738f6b8-90af-47fc-b1a4-0c1cfdf1a810","sectionTitle":"The Pricing Section","linkId":"31d2e2b1-84a9-4373-b30e-7ab77f4a72e6"},{"uid":"f463c4e1-4d62-4fd2-bf51-2dfc0da46032","sectionTitle":"Right Fit Section","linkId":"5585a85e-95e7-4602-8579-1c3e337c7ae3"},{"uid":"cc8bcf08-4a90-4848-88f5-ace26dbadcb7","sectionTitle":"FAQ Section","linkId":"f2ad2e48-6d83-40fb-a381-74352150fc94"},{"uid":"4f7a81e3-1aa1-4b15-92ea-cb1ff1428bc8","sectionTitle":"The Final Tour CTA Section","linkId":"ba43e511-d437-4d1d-99d0-29d3019a1d40"},{"uid":"8b2a0955-5cc3-4618-af4a-fdfbbf4265de","sectionTitle":"Footer Section","linkId":"f1833ffd-79f9-4ab5-850b-f4e79e0a96ef"}],"pageUserGroups":[],"title":{"en":"Weekend Wedding Estate Buyout · Lake Geneva | Whispering Woods Events"},"meta":{"desc":{"en":"Weekend wedding estate buyouts at $17,900 on 40 private acres in Harvard, IL, south of Lake Geneva. Solar-powered forest venue for 2–280 guests. Engagement sessions on the grounds by appointment."},"keywords":{"en":"Weekend Wedding Estate Buyout Lake Geneva, Eco-Friendly Solar Powered Wedding Venue Illinois, Large Capacity Forest Wedding Secluded Estate, Private Forest Wedding Venue Chicago Milwaukee, engagement photos Harvard IL, estate engagement session Lake Geneva, engagement pictures private estate Illinois"},"socialDesc":{"en":"Forty private acres · $17,900 weekend buyout · Harvard, IL south of Lake Geneva."},"socialTitle":{"en":"Weekend Wedding Estate Buyout · Whispering Woods Events"},"structuredData":{"__schema_json_ld":"{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebSite\",\"@id\":\"https://www.whisperingwoodsevents.com/#website\",\"url\":\"https://www.whisperingwoodsevents.com\",\"name\":\"Whispering Woods Events\"},{\"@type\":\"WebPage\",\"@id\":\"https://www.whisperingwoodsevents.com/#webpage\",\"url\":\"https://www.whisperingwoodsevents.com/\",\"name\":\"Weekend Wedding Estate Buyout\",\"isPartOf\":{\"@id\":\"https://www.whisperingwoodsevents.com/#website\"},\"about\":{\"@id\":\"https://www.whisperingwoodsevents.com/#venue\"}},{\"@type\":[\"EventVenue\",\"LocalBusiness\"],\"@id\":\"https://www.whisperingwoodsevents.com/#venue\",\"name\":\"Whispering Woods Events\",\"url\":\"https://www.whisperingwoodsevents.com\",\"description\":\"Private 40-acre estate weekend wedding buyouts south of Lake Geneva. Engagement photography on the grounds by appointment.\",\"email\":\"info@whisperingwoodsevents.com\",\"priceRange\":\"$$$\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Harvard\",\"addressRegion\":\"IL\",\"postalCode\":\"60033\",\"addressCountry\":\"US\"},\"areaServed\":[\"Greater Chicago Area\",\"Lake Geneva Corridor\",\"McHenry County IL\"],\"amenityFeature\":[{\"@type\":\"LocationFeatureSpecification\",\"name\":\"40 Private Acres\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"One Wedding Per Weekend\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Solar Powered\",\"value\":true}]}]}"}},"metaImage":"images/Megan%26CollinWhisperingWoodsWedding-3235-compressed_Webpifier.webp?_wwcv=38","security":{}},{"id":"fd094741-c8cc-43f1-8a50-0c7002ee470a","linkId":"fd094741-c8cc-43f1-8a50-0c7002ee470a","name":"The Bespoke Journey","folder":null,"paths":{"en":"bespoke-journey","default":"bespoke-journey"},"langs":["en"],"cmsDataSetPath":null,"sections":[{"uid":"6cafd83d-3a3c-4974-8f9d-d647ca19758a","sectionTitle":"Bespoke Journey Hero","linkId":"f7ae56f4-f95e-4848-8d97-3d89d638c693"},{"uid":"e1d16c52-7715-47fd-a161-03e5f65b8b74","sectionTitle":"Bespoke Journey Body","linkId":"016b51a1-32be-4f28-9465-532ce5cf232e"},{"uid":"373d5493-a859-4be9-899e-02203f9ccd15","sectionTitle":"Engagement Sessions Section","linkId":"0422bd75-0845-4f25-845d-ce32393a5751"},{"uid":"02ba2fde-f0a5-4336-ab9e-82de844a424b","sectionTitle":"Bespoke Journey CTA","linkId":"715aa5f4-1063-4157-9d1f-f5d7b0094dcc"},{"uid":"8b2a0955-5cc3-4618-af4a-fdfbbf4265de","sectionTitle":"Footer Section","linkId":"f1833ffd-79f9-4ab5-850b-f4e79e0a96ef"}],"pageUserGroups":[],"title":{"en":"Weekend Wedding Estate Buyout Lake Geneva | The Bespoke Journey"},"meta":{"desc":{"en":"Weekend wedding estate buyouts on 40 private acres in Harvard, IL, south of Lake Geneva. Your 48-hour weekend timeline with complete vendor freedom and private estate engagement sessions by appointment."},"keywords":{"en":"Weekend Wedding Estate Buyout Lake Geneva, Private Forest Wedding Venue Chicago Milwaukee, engagement photos Harvard IL, estate engagement session Lake Geneva, engagement pictures private estate Illinois"},"socialDesc":{"en":"48-hour weekend buyout · vendor freedom · engagement sessions on the estate."},"socialTitle":{"en":"Weekend Wedding Estate Buyout Lake Geneva | The Bespoke Journey"},"structuredData":{"__schema_json_ld":"{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebPage\",\"@id\":\"https://www.whisperingwoodsevents.com/bespoke-journey#webpage\",\"url\":\"https://www.whisperingwoodsevents.com/bespoke-journey\",\"name\":\"The Bespoke Journey\",\"description\":\"Weekend estate buyout timeline, vendor freedom, and engagement sessions on forty private acres south of Lake Geneva.\",\"about\":{\"@id\":\"https://www.whisperingwoodsevents.com/#venue\"}},{\"@type\":[\"EventVenue\",\"LocalBusiness\"],\"@id\":\"https://www.whisperingwoodsevents.com/#venue\",\"name\":\"Whispering Woods Events\",\"url\":\"https://www.whisperingwoodsevents.com\",\"description\":\"Private 40-acre weekend wedding buyouts in Harvard, IL. Engagement photography on the grounds by appointment.\",\"priceRange\":\"$$$\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Harvard\",\"addressRegion\":\"IL\",\"postalCode\":\"60033\",\"addressCountry\":\"US\"},\"areaServed\":[\"Greater Chicago Area\",\"Lake Geneva Corridor\",\"McHenry County IL\"]}]}"}},"metaImage":"images/Megan%26CollinWhisperingWoodsWedding-3235-compressed_Webpifier.webp?_wwcv=38","security":{}}],"plugins":[{"id":"1c5f5c0f-5609-4031-9e57-5bb4811be7b3","name":"Youtube","namespace":"youtube"},{"id":"66a79c98-70e7-4bc4-8859-20776b024ec2","name":"PWA","namespace":"pwa"},{"id":"60610cfd-fa28-4fc1-9e72-088b5c667e81","name":"Calendly","namespace":"calendly"},{"id":"832d6f7a-42c3-43f1-a3ce-9a678272f811","name":"Date","namespace":"dayjs"},{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"REST API","namespace":"restApi"},{"id":"cd33cf33-e29f-4e8c-ac26-b997fe507ce7","name":"Xano","namespace":"xano"}]};
window.wwg_cacheVersion = 38;
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
