# LUXE MCP audit · Home · 2026-09-15

Project: **WhisperingWoodsLUXE** (`1b8147da-2812-42a5-946e-f83c582d3071`) · Page: **Home** (`991a8992-afed-4eaf-b77e-13a81380ad12`)

## Footer links (canvas)

| Element | URL | Status |
|---------|-----|--------|
| Footer Terms Link | `https://whisperingwoodsluxe.com/terms` | Canon OK |
| Footer Privacy Link | `https://whisperingwoodsluxe.com/privacypolicy` | Canon OK |
| Footer Events | `whisperingwoodsevents.com` + UTM | OK |
| Footer Journal | `whisperingwoodsweddings.com` + UTM | OK |

Export grep: no `/privacy` or SPQ paths. Bridge **v27** re-applies canon on runtime (modal + stale preview).

## Sticky `#ww-sticky-nav` (canvas MCP)

| Issue | Fix applied |
|-------|-------------|
| DS class `mobile-bottom-nav` forced linen bar | **Removed** class from pill |
| `rgba(20,31,25,0.88)` fill | **transparent** + blur only |
| Bridge backup | `#ww-sticky-nav { background: transparent !important }` |

## Hero (canvas + bridge)

| Issue | Cause | Fix |
|-------|--------|-----|
| Black flash / YouTube chrome | iframe letterbox + late load | **Bridge v27**: hide iframe until `data-ww-hero-video-ready`, pine gradient placeholder, overscale crop |
| Video under text | DOM order + opacity 0.4 | Canvas: video **opacity 1**, z-index 0; copy **z-index 3** |
| Hero shell | Section not pinned | Canvas: hero block **100svh**, `#141f19`, overlay **absolute** + gradient only |
| Luxe frame | — | Bridge: **10px pine inset** + gold hairline on video mask |

## Head paste

Re-paste **`WEWEB_PROJECT_HEAD_BRIDGE_v26.html`** (content is **v27** stamp) → publish.

Smoke:

```js
document.documentElement.getAttribute("data-ww-head-version") === "2026.09.15.v27"
```

## Still canvas-owned

1024 shell, section pine/linen backgrounds, booking modal styling, Chalet hover, footer typography/spacing.
