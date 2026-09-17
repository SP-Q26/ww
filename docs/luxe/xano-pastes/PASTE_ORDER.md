# Paste order (10 endpoints)

1. `01-wwl-roster-get.xs`
2. `02-wwl-slots-get.xs`
3. `03-wwl-slots-batch-post.xs`
4. `04-wwl-book-post.xs` ← needs `legal/request_client_meta` if you use SPQ legal stack
5. `05-wwl-wait-post.xs`
6. `06-wwl-stripe-webhook-post.xs` ← Stripe URL last after book smoke
7. `07-wwl-schedule-t10-post.xs`
8. `08-wwl-lab-rollup-get.xs`
9. `09-wwl-lab-batch-post.xs`
10. `10-wwl-orders-batch-post.xs`

**If `04` fails on dynamic `line_items[n]`:** duplicate the four SKU combos with fixed `line_items[0]`, `[1]`, `[2]` keys (deposit / deposit+chalet / full / full+chalet).

**T−10 v1:** returns Checkout URLs for email — not off-session charge yet. Webhook still marks paid when mom pays balance link.
