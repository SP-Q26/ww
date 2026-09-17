# Luxe Home · MCP + live audit (2026-09-14)

**Project:** WhisperingWoodsLUXE `1b8147da-2812-42a5-946e-f83c582d3071`  
**Live:** `https://1b8147da-2812-42a5-946e-f83c582d3071-production.weweb.io/`  
**Head (git):** `docs/luxe/WEWEB_PROJECT_HEAD_V23_FULL.html` → **v24** paste

## Executive summary

| Area | Verdict | Blocker |
|------|---------|---------|
| Layout shell | **P0** | Production **1440px** full bleed; Head targeted obsolete section UID `df7f8a87…` — **v24** caps `.sections-wrapper` at **1024px** |
| Hero YouTube | **P0** | iframe ~1400×900 with visible **inset** letterbox; v24 masks + hides iframe until `load` |
| Sticky nav | **P1** | Compiled `.ww-s-dA` **max-height: 0** on mobile crushes pill; canvas `#ww-sticky-nav` updated; v24 CSS override |
| Buttons | **P1** | Canvas CTAs **14px 36px** vs Head **0.85rem 1.35rem** — v24 unifies **48px** min height |
| Typography | **P2** | DS mixes **Inter / Playfair / Cormorant**; page Head locks Cormorant + Montserrat kicker — spot-check each section in editor |
| Motion / perf | **P2** | 0.72s section fades + full font weights; v24 shortens motion, trims font import, `content-visibility` below fold |
| Vercel slice | **OK** | `luxe-omega.vercel.app` heirloom/legal **200**; Stripe API **500** until env |
| Hotfix workflows | **OK** | Removed from canvas; **republish** so production drops `#ww-luxe-reveal-hotfix` |

## Live measurements (desktop 1440px, pre-v24 publish)

| Signal | Value |
|--------|--------|
| `data-ww-head-version` | `2026.09.14.v23` |
| `.sections-wrapper` width | 1440px |
| Hero iframe | ~1397×900, `border: 0px inset` |
| `#ww-sticky-nav` | 448×40 |
| `body.ww-site` | present |

## WeWeb MCP (canvas)

| Resource | Finding |
|----------|---------|
| Home page | 12 `.section-base` sections; outer wrapper `.ww-s-d7` |
| Hero | `68072bf6…` · min-height 100svh · overlay div `b498dd32…` |
| Hero video | `.ww-video-youtube` · class `ww-a-RvK8Hgqd5OKD_Q9w` |
| Sticky | `#ww-sticky-nav` `7fcc75b8…` — **edited** center `left:50%` + `translateX(-50%)`, `maxHeight:none` mobile, blur 12px |
| Workflows | No `hotfix` workflows |
| Design tokens | Estate palette OK; typo tokens include unused Playfair/H1-mobile — prefer Head locks for Luxe |

## Git / export drift

| Item | Note |
|------|------|
| Shell CSS selector | `ww-section-df7f8a87…` is **Events-era**; live page uses `ww-s-d7` + flat `section-base` |
| `public/data/991a8992….json` | `cacheVersion` 12; sticky compile still emits `max-height:0` until next export after canvas + Head |

## Vercel (`spq/luxe`)

| Check | Result |
|-------|--------|
| Production alias | `luxe-omega.vercel.app` · deploy Ready |
| `PREVIEW_HOST=… smoke-paths.sh` | Static paths **200** |
| MCP `list_teams` | Empty — re-auth SPQ for dashboard audit (`VERCEL_MCP_AUDIT.md`) |

## Ship checklist (operator)

1. Paste **full** `WEWEB_PROJECT_HEAD_V23_FULL.html` (v24) into **Project → Custom code → Head** (replace all).
2. **Publish** WeWeb (new version).
3. Smoke: `data-ww-head-version === '2026.09.14.v24'`, wrapper width ≤ 1024 on desktop, no hero black frame, sticky 48px min on iOS width.
4. iPhone: Safari · hero · sticky expand · one CTA · modal scroll.
5. Optional: fix sticky **parent section** mobile `max-height` in editor (section class `ww-s-dA`) to `none` so export CSS stops fighting Head.

## Photo / font spot audit (manual)

- **Hero:** video cover crop on **390px** width; no letterbox flash.
- **Backdrops / Chalet:** images `object-fit: cover`, 4:5 on mobile per page description.
- **Headlines:** H1/H2 Cormorant italic; body Inter/Montserrat per Head — remove Playfair from elements if still bound in canvas.
- **Pricing / FAQ:** line length ≤ ~28rem inside 1024 shell.
