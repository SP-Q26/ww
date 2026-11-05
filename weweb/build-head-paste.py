#!/usr/bin/env python3
"""Rebuild WEWEB_HEAD_PASTE.html from modular weweb/ sources."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VERSION = (ROOT / "VERSION").read_text().strip()
CONFIG = json.loads((ROOT / "config.json").read_text())


def main() -> None:
    seo_title = (
        "Whispering Woods Events | 40-Acre Outdoor Wedding Estate · Harvard IL"
    )
    seo_desc = (
        "Private 40-acre outdoor wedding estate 15 minutes from Lake Geneva. "
        "Ceremony and reception on pine, pond, and meadow grounds — one wedding per weekend. "
        "Tour the grounds."
    )
    site_url = CONFIG.get("production_domain", "https://www.whisperingwoodsevents.com/")
    editor_url = CONFIG.get("editor_url", "https://unyielding-publisher-editor.weweb.io/")
    preview_url = CONFIG.get("preview_url", "https://unyielding-publisher-production.weweb.io/")
    project_slug = CONFIG.get("project_slug", "unyielding-publisher")

    ratings = CONFIG.get("ratings", {})
    ratings_js = json.dumps(ratings, indent=2)

    header = f"""<!--
  Whispering Woods — WeWeb Page Head (complete paste)
  @ww-head-paste v{VERSION}
  Project: {project_slug} (WW)
  Editor: {editor_url}
  Preview: {preview_url}
  Paste into: Project Settings → Custom code → Head (not Home page head)
  Rebuild: python3 WW/weweb/build-head-paste.py
  Manifest: WW/docs/SEASON_ACCENT_MANIFEST.md
-->

<title>{seo_title}</title>
<meta name="description" content="{seo_desc}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="{site_url}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{site_url}" />
<meta property="og:title" content="{seo_title}" />
<meta property="og:description" content="{seo_desc}" />
<meta property="og:site_name" content="Whispering Woods Events" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{seo_title}" />
<meta name="twitter:description" content="{seo_desc}" />
<meta name="keywords" content="Whispering Woods Events, outdoor wedding venue Harvard IL, Lake Geneva wedding venue, 40 acre wedding estate, private wedding weekend, ceremony and reception Illinois, barn wedding Harvard, tour wedding venue, one wedding per weekend" />

<script>
window.WW_HEAD_VERSION = "{VERSION}";
window.WW_SITE_CONFIG = {{
  head_version: "{VERSION}",
  site_url: "{site_url}",
  cta_label: "Tour the Grounds",
  cta_kicker: "Historic grounds · Your chapter",
  tour_booking_url: "{CONFIG["tour_booking_url"]}",
  tour_loader_dotlottie: "",
  email: "{CONFIG["email"]}",
  faq_url: "#faq",
  active_season_var: "6e7f5084-d32d-4fb7-98bd-1337a99fc5fb",
  gallery_images_var: "f7cfb366-eba3-4fc9-b3ff-5b67d379c7f1",
  ratings: {ratings_js},
  tokens: {{
    pine: "a5dd128b-549f-4f54-9c83-114918bbf26e",
    linen: "377beacf-1e31-4367-8516-81d53cc47f4f",
    gold: "c0c11ce2-c659-4b11-951e-ba8bf27c74cc",
    sage: "83b57ec3-0de7-43bd-b27b-e760ebbff14d",
    bark: "d707f6d8-dd3a-4b94-babc-f729f6af8fe4",
    accent_spring: "ebfadec8-ae7f-4d30-adba-4d923a28b531",
    accent_summer: "a05fbde1-3036-4151-9120-5511b7036d6f",
    accent_autumn: "73adb72f-1c0f-4c6a-b07f-e32d10c2587e",
    tint_spring: "e8ac40e2-c651-4e4b-906e-d06029b3f80b",
    tint_summer: "ec680406-f325-4d00-9578-fa1347a85154",
    tint_autumn: "0f9e2011-92e6-4a68-930c-5c958d6fe6f7"
  }}
}};
</script>

<style>
/* @ww-head-paste v{VERSION} */
"""

    bridge = f"""
<script>
/* @ww-head-paste v{VERSION} */
(function wwWeWebBridge() {{
  "use strict";
  function boot() {{
    document.body && document.body.classList.add("ww-site", "ww-luxe-veil");
    document.documentElement.setAttribute("data-ww-head-version", "{VERSION}");
  }}
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}})();
</script>
"""

    css_files = [
        "ww-brand.css",
        "ww-weweb-production.css",
        "ww-season-showcase.css",
        "ww-luxe-layout.css",
        "ww-season-luxe.css",
        "ww-responsive-luxe.css",
        "ww-mobile-parity-lock.css",
        "ww-luxe-motion.css",
        "ww-heron-motion.css",
    ]

    scripts = [
        "ww-season-mood.js",
        "ww-gallery-drawer.js",
        "ww-sticky-expand.js",
        "ww-luxe-motion.js",
        "ww-heron-motion.js",
        "ww-site-bridge.js",
    ]

    parts = [header]
    for name in css_files:
        parts.append((ROOT / name).read_text())
        parts.append("\n")
    parts.append("</style>\n")

    for name in scripts:
        parts.append(f"\n<script>\n{(ROOT / name).read_text()}\n</script>\n")
    parts.append(bridge)

    out = "".join(parts)
    (ROOT / "WEWEB_HEAD_PASTE.html").write_text(out)
    print(f"Wrote {ROOT / 'WEWEB_HEAD_PASTE.html'} v{VERSION} ({len(out)} chars)")


if __name__ == "__main__":
    main()
