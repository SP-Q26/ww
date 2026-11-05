/* App workflow WW Site Boot — paste into custom-js action __WW_BOOT__ */
const SEASON_VAR = '6e7f5084-d32d-4fb7-98bd-1337a99fc5fb';
const GALLERY_SEASON_VAR = '301d0edc-0a02-47eb-85e2-aad3a5ecec04';
const VALID = { spring: 1, summer: 1, autumn: 1 };
const TAB_SEASON = {
  '8b68b655-aefa-4e90-aedd-9da03fa83f04': 'spring',
  '71f57801-4f90-4b3e-983a-9b266f6de9a2': 'summer',
  'acf6e8c7-9f3a-41c7-b491-7123eded81db': 'autumn',
};
const PALETTE = {
  spring: {
    accent: '#8a9a86',
    deep: '#1a2b22',
  },
  summer: {
    accent: '#c49a5a',
    deep: '#1e2d24',
  },
  autumn: {
    accent: '#b86b32',
    deep: '#241a14',
  },
};
const DREAM = {
  spring: 'Begin where the woods meet the aisle.',
  summer: 'Long light on the ponds — the whole weekend ahead.',
  autumn: 'Gold on forty acres, still only yours.',
};
const DEFAULT_POETRY =
  'Forty acres of private woods on a 40-acre estate — yours for the weekend.';
const TOUR_URL = 'https://calendar.app.google/d3iGi3bVmyjSdxyn9';
const PROD = 'https://www.whisperingwoodsevents.com';
const doc = wwLib.getFrontDocument();
const root = doc.documentElement;
const win = doc.defaultView;

if (doc.body) {
  doc.body.style.paddingBottom = 'calc(76px + env(safe-area-inset-bottom, 0px))';
  doc.body.style.webkitTapHighlightColor = 'transparent';
  doc.body.classList.add('ww-site');
}

if (!win.WW_SITE_CONFIG) {
  win.WW_SITE_CONFIG = {
    tour_booking_url: TOUR_URL,
    active_season_var: SEASON_VAR,
    email: 'info@whisperingwoodsevents.com',
  };
}

function assetBase() {
  const host = win.location.hostname || '';
  if (host.indexOf('whisperingwoodsevents.com') !== -1) return '';
  if (host.indexOf('weweb.io') !== -1 || host.indexOf('vercel.app') !== -1)
    return win.location.origin;
  return PROD;
}

function loadTourAssets() {
  const base = assetBase();
  if (!doc.querySelector('link[data-ww-tour-css]')) {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + '/ww-tour-modal.css';
    link.dataset.wwTourCss = '1';
    doc.head.appendChild(link);
  }
  function loadScript(src, done) {
    if (doc.querySelector('script[data-src="' + src + '"]')) {
      done && done();
      return;
    }
    const s = doc.createElement('script');
    s.src = src;
    s.dataset.src = src;
    s.onload = function () {
      done && done();
    };
    doc.head.appendChild(s);
  }
  loadScript(base + '/ww-tour-modal.js', function () {
    loadScript(base + '/ww-site-bridge.js');
  });
}
loadTourAssets();

function openTourDrawer(ev) {
  if (ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  if (typeof win.wwOpenTourModal === 'function') {
    win.wwOpenTourModal();
    return;
  }
  loadTourAssets();
  win.dispatchEvent(new CustomEvent('ww:open-tour-request'));
  let tries = 0;
  const retry = function () {
    tries += 1;
    if (typeof win.wwOpenTourModal === 'function') {
      win.wwOpenTourModal();
      return;
    }
    if (tries < 16) win.setTimeout(retry, 150);
  };
  retry();
}

if (!root.dataset.wwTourCapture) {
  root.dataset.wwTourCapture = '1';
  doc.addEventListener(
    'click',
    function (ev) {
      const el = ev.target.closest('a, button, [role="button"]');
      if (!el) return;
      const href = (el.getAttribute('href') || '').toLowerCase();
      const text = (el.textContent || '').trim();
      if (
        href.indexOf('calendly.com') === -1 &&
        href.indexOf('calendar.app.google') === -1 &&
        !/tour the grounds|^tour$/i.test(text)
      ) {
        return;
      }
      if (el.closest('#ww-sticky-nav') && !el.closest('#ww-sticky-nav.is-expanded'))
        return;
      openTourDrawer(ev);
    },
    true
  );
}

if (!doc.getElementById('ww-kill-scroll-anim')) {
  const st = doc.createElement('style');
  st.id = 'ww-kill-scroll-anim';
  st.textContent = [
    'html.ww-site [id^="scroll-"] {',
    '  animation: none !important;',
    '  opacity: 1 !important;',
    '  transform: none !important;',
    '}',
  ].join('\n');
  doc.head.appendChild(st);
}

function poetryEl() {
  return (
    doc.querySelector('#ww-dreamline') ||
    doc.querySelector('.ww-element-cd1c365d-76ee-4806-824d-ebef5f137aee')
  );
}

function updatePoetry(season) {
  const el = poetryEl();
  if (!el) return;
  const line = season && DREAM[season] ? DREAM[season] : DEFAULT_POETRY;
  if (el.textContent !== line) el.textContent = line;
}

function syncGalleryFilter(season) {
  const val = season || 'all';
  try {
    if (!wwLib.wwVariable || typeof wwLib.wwVariable.updateValue !== 'function') return;
    wwLib.wwVariable.updateValue(GALLERY_SEASON_VAR, val);
  } catch (e) {}
}

function paintSeasonTokens(season) {
  const tokenKeys = [
    '--ww-accent',
    '--ww-section-deep',
    '--ww-gold',
    '--c0c11ce2-c659-4b11-951e-ba8bf27c74cc',
    '--def92927-84a9-422e-bdae-62d522cc2e42',
    '--a5dd128b-549f-4f54-9c83-114918bbf26e',
  ];
  if (!season || !PALETTE[season]) {
    tokenKeys.forEach(function (k) {
      root.style.removeProperty(k);
    });
    return;
  }
  const p = PALETTE[season];
  root.style.setProperty('--ww-accent', p.accent);
  root.style.setProperty('--ww-section-deep', p.deep);
  root.style.setProperty('--ww-gold', p.accent);
  root.style.setProperty('--c0c11ce2-c659-4b11-951e-ba8bf27c74cc', p.accent);
  root.style.setProperty('--def92927-84a9-422e-bdae-62d522cc2e42', p.deep);
  root.style.setProperty('--a5dd128b-549f-4f54-9c83-114918bbf26e', p.deep);
}

function applySeason(val) {
  const season = val && VALID[val] ? val : '';
  root.setAttribute('data-season', season);
  if (doc.body) doc.body.setAttribute('data-season', season);
  paintSeasonTokens(season);
  if (typeof win.wwSetSeason === 'function') {
    win.wwSetSeason(season, { silent: true, skipDream: true, force: true });
  }
  updatePoetry(season);
  syncGalleryFilter(season);
}

function readSeason() {
  let saw = false;
  let v;
  try {
    if (wwLib.wwVariable && typeof wwLib.wwVariable.getValue === 'function') {
      v = wwLib.wwVariable.getValue(SEASON_VAR);
      saw = true;
    }
  } catch (e) {}
  if (!saw) return null;
  if (v === '' || v === null || v === undefined) return '';
  return VALID[v] ? v : '';
}

let last = null;
function tickSeason() {
  const next = readSeason();
  if (next === null) return;
  if (next !== last) {
    last = next;
    applySeason(next);
  }
}
tickSeason();
win.setInterval(tickSeason, 200);

if (!root.dataset.wwSeasonTabBridge) {
  root.dataset.wwSeasonTabBridge = '1';
  doc.addEventListener(
    'click',
    function (ev) {
      let seasonKey = null;
      for (const uid in TAB_SEASON) {
        if (ev.target.closest('.ww-element-' + uid)) {
          seasonKey = TAB_SEASON[uid];
          break;
        }
      }
      if (!seasonKey) return;
      const before = root.getAttribute('data-season') || '';
      const toggled = before === seasonKey ? '' : seasonKey;
      win.setTimeout(function () {
        const fromVar = readSeason();
        let next;
        if (fromVar === null) {
          next = toggled;
        } else if (fromVar === before) {
          next = toggled;
        } else {
          next = fromVar;
        }
        if (next !== last) {
          last = next;
          applySeason(next);
        }
      }, 80);
    },
    true
  );
}

return true;
