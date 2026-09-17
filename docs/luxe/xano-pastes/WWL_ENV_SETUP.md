# WWLuxe · Xano env (all `WWL_*`)

**Rule:** Every secret for the estate ops API group lives in **Xano → Settings → Environment variables** with a **`WWL_`** prefix. Do not reuse bare `STRIPE_SECRET_KEY` on Xano (Vercel keepsake API may keep its own name — separate surface).

---

## Canonical names (Xano `wwl_ops`)

| Variable | Used by | Value |
|----------|---------|--------|
| `WWL_PUBLIC_ORIGIN` | `wwl/book` default success/cancel host | `https://whisperingwoodsluxe.com` · preview: `https://luxe-omega.vercel.app` |
| `WWL_STRIPE_SECRET_KEY` | `wwl/book`, `wwl/stripe/webhook`, `wwl/schedule/t10` | MMI test `sk_test_…` or live `sk_live_…` |
| `WWL_STRIPE_WEBHOOK_SECRET` | *(optional)* signature verify on `wwl/stripe/webhook` | `whsec_…` from Stripe endpoint |
| `WWL_OPS_API_KEY` | `wwl/slots`, `wwl/slots/batch`, `wwl/lab/rollup`, `wwl/lab/batch`, `wwl/orders/batch` | You generate — see below |
| `WWL_CRON_SECRET` | `wwl/schedule/t10` | You generate — see below |
| `WWL_TAX_WY_ORIGIN_JSON` | *(optional)* Stripe Tax origin | One-line JSON · WY HQ |
| `WWL_TAX_IL_PERFORMANCE_JSON` | *(optional)* IL estate performance | One-line JSON · Harvard, IL |

Pastes read these as `$env.WWL_STRIPE_SECRET_KEY`, `$env.WWL_OPS_API_KEY`, etc.

---

## Speed mode (inaugural week · Xano Run without headers)

**Do not hardcode the key in API stacks.** For fast editor testing:

1. **Clear** env `WWL_OPS_API_KEY` (empty value) — ops routes **02, 03, 08, 09, 10** skip the header check when env is blank (git pastes updated).
2. Or **bulk-edit** `sales_open` in **Database → `wwl_slot`** and skip `slots/batch` entirely.

Re-fill `WWL_OPS_API_KEY` before any public ops URL is guessable; then callers send header `X-API-Key`.

**Xano Run headers (when env is set):** open the endpoint → **Run** → **Headers** (or **Request** → custom headers) → add `X-API-Key` with the same value as env. Internal Run does not always show Headers on every Xano version — empty env is the supported workaround.

---

## Create `WWL_OPS_API_KEY` (operator / scripts only)

**Not** for moms, WeWeb modal, or public JS. Gates **read/batch** endpoints when the request sends header **`X-API-Key`**.

**Generate (terminal):**

```bash
openssl rand -base64 32
```

Example shape: `k7x…=` (store the full string; no quotes in Xano value field).

**Paste:**

| Where | What |
|-------|------|
| **Xano** | Env `WWL_OPS_API_KEY` = that string |
| **Your laptop** | `export WWL_OPS_API_KEY=…` when running `smoke-wwl-xano.sh` |
| **Password manager / ops runbook** | Same string for you + anyone running batch/lab tools |

**Do not paste into:** WeWeb project variables, page workflows, git, or customer-facing code. Public routes stay **`wwl/roster`**, **`wwl/book`**, **`wwl/wait`** (no ops key).

**Future:** If you add a Vercel **admin** route that calls `wwl/slots/batch`, put `WWL_OPS_API_KEY` in **Vercel env** server-side only — never `NEXT_PUBLIC_*`.

---

## Create `WWL_CRON_SECRET` (T−10 job only)

Same generator:

```bash
openssl rand -base64 32
```

**Paste:**

| Where | What |
|-------|------|
| **Xano** | Env `WWL_CRON_SECRET` |
| **Cron caller** | HTTP header `X-Cron-Secret: <same value>` on `POST …/wwl/schedule/t10` |

**Cron options:**

1. **Xano scheduled task** (if your plan supports it) → POST to your own `wwl/schedule/t10` with the header.
2. **External** (GitHub Actions, EasyCron, etc.) → daily hit `WWL_XANO_BASE/wwl/schedule/t10` with `X-Cron-Secret`.
3. **Manual smoke** → `curl -X POST -H "X-Cron-Secret: $WWL_CRON_SECRET" …`

Not used in WeWeb or Stripe Dashboard.

---

## Stripe webhook + book

| Item | Where |
|------|--------|
| `WWL_STRIPE_SECRET_KEY` | Xano env only (book + t10 create Checkout) |
| Webhook URL | Stripe → `https://<instance>.n7.xano.io/api:<group>/wwl/stripe/webhook` |
| `WWL_STRIPE_WEBHOOK_SECRET` | Xano when you add verify; Stripe Dashboard copies `whsec_…` |

**Vercel `/heirloom` checkout** can keep `STRIPE_SECRET_KEY` or `WWLUXE_STRIPE_SECRET_KEY` on the **luxe** project — that is **not** the same as Xano unless you deliberately use the same MMI key in both places.

---

## Codenames later (days before shoot)

You do **not** need final Willow/Lantern names at schema seed time.

**Smoke / inaugural seed:**

- `session_code`: `01-Fall`
- `spot_codename`: placeholders `01` … `24` (or `Spot-01`)
- `slot_ref`: `01-Fall·01` … `01-Fall·24`
- `sort_order`: 1–24

**Before `sales_open: true`:**

```json
POST wwl/slots/batch
X-API-Key: <WWL_OPS_API_KEY>

{
  "session_code": "01-Fall",
  "slots": [
    { "slot_ref": "01-Fall·01", "spot_codename": "Willow", "time_block": "09:40" }
  ]
}
```

*(If you rename codename, update **`slot_ref`** to `01-Fall·Willow` in the same patch or re-seed — moms see `slot_ref` in email/QR.)*

WeWeb **`POST wwl/book`** sends **`session_code`** only (e.g. `01-Fall`) plus parent/senior/payment fields — **not** `spot_codename`. Xano auto-claims the next open seat by `sort_order`. Rename codenames via **`POST wwl/slots/batch`** before estate week; moms never choose at checkout.

---

## Quick verify

```bash
export WWL_XANO_BASE="https://….n7.xano.io/api:…"
export WWL_OPS_API_KEY="…"
./docs/luxe/xano-pastes/smoke-wwl-xano.sh
```
