# WW Journal · `/api/subscribe`

Canvas workflow **Execute Subscribe API Call** posts to `{baseUrl}/api/subscribe` with:

```json
{
  "email": "<validated input>",
  "source": "ww_journal_home",
  "page": "<current url>",
  "tags": ["weddings-blog", "wwj"]
}
```

## Vercel env (production)

| Variable | Required | Purpose |
|----------|----------|---------|
| `JOURNAL_SUBSCRIBE_WEBHOOK_URL` | Yes | n8n (or other) webhook that stores the lead |
| `JOURNAL_SUBSCRIBE_WEBHOOK_SECRET` | No | Sent as `x-wwj-subscribe-secret` when set |

Without `JOURNAL_SUBSCRIBE_WEBHOOK_URL`, the route returns **503** `subscribe_not_configured` (workflow shows error; not 404).

## Smoke

```bash
curl -sS -X POST "https://ww-journal.vercel.app/api/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email":"you@whisperingwoodsevents.com","source":"smoke","tags":["wwj"]}'
```

Expect **200** `{"ok":true}` when webhook is configured and accepts the payload.

## Implementation

`api/subscribe.js` on branch **`journal`** · deployed with **`ww-journal`** Vercel project.
