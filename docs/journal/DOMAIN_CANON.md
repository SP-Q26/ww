# WW Journal · production URL

| Item | Value |
|------|--------|
| **Public site** | **https://www.whisperingwoodsweddings.com/** (site root — **not** `/journal`) |
| **WeWeb route** | Home page path `home` → also works at `/home` (rewrite) |
| **Articles** | `https://www.whisperingwoodsweddings.com/p/{slug}` |
| **Vercel project** | `ww-journal` · branch `journal` |
| **Preview** | `https://ww-journal.vercel.app/` |

## DNS

- **`www.whisperingwoodsweddings.com`** → Vercel (`ww-journal`) · Journal SPA at **/**.
- **Apex `whisperingwoodsweddings.com`** should also point to Vercel (or 301 to `www`) so bare-domain visitors see the Journal, not Squarespace → events.

## Legacy `/journal` paths

`vercel.json` **301** redirects `/journal` and `/journal/*` to `/` and `/*` so old links do not 404.
