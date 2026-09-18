// POST wwl/book — consent + auto-claim next open seat + Stripe Checkout (estate lines)
// API group: wwl_ops · auth: NONE
// Moms do NOT pick spot_codename at booking — ops assigns estate codenames at shoot run-up.
// Picks lowest sort_order open seat for metadata; sets pending_checkout only after Stripe returns checkout URL.
// Paid seat (deposit_paid / paid_in_full) is webhook-only (06). Abandoned checkout stays pending until ops or checkout.session.expired release.
// Line law: lib/mmi/estate-checkout-lines.mjs (deposit always; full adds balance; optional Chalet)
// If Xano rejects dynamic line_items keys, see PASTE_ORDER.md (unroll four branches).
// Paste v2.7 · receipt: payment_intent_data[receipt_email] + Dashboard Customer emails → Successful payments ON.

query "wwl/book" verb=POST {
  api_group = "wwl_ops"

  input {
    text session_code filters=trim
    text parent_name filters=trim
    email parent_email
    text parent_phone? filters=trim
    text senior_name filters=trim
    text estate_payment_type filters=trim|lower
    bool includes_chalet?
    text terms_version filters=trim
    text success_url? filters=trim
    text cancel_url? filters=trim
  }

  stack {
    security.create_uuid as $consent_uuid

    var $ip_address {
      value = $env.$remote_ip
    }

    var $user_agent {
      value = ($env.$http_headers|get:"user-agent"|to_text|trim)
    }

    conditional {
      if (($ip_address == null) || ($ip_address == "")) {
        function.run "legal/request_client_meta" {
        } as $client

        var.update $ip_address {
          value = $client|get:"ip_address"
        }

        conditional {
          if (($user_agent == null) || ($user_agent == "")) {
            var.update $user_agent {
              value = $client|get:"user_agent"
            }
          }
        }
      }
    }

    var $pay_type {
      value = ($input.estate_payment_type|to_text|to_lower|trim)|first_notempty:"deposit"
    }

    var $pay_type_ok {
      value = false
    }

    conditional {
      if ($pay_type == "deposit") {
        var.update $pay_type_ok {
          value = true
        }
      }
    }

    conditional {
      if ($pay_type == "full") {
        var.update $pay_type_ok {
          value = true
        }
      }
    }

    precondition ($pay_type_ok == true) {
      error_type = "inputerror"
      error = "estate_payment_type must be deposit or full."
    }

    var $chalet {
      value = ($input.includes_chalet == true) || (($input.includes_chalet|to_text|to_lower) == "true")
    }

    var $tos_v {
      value = ($input.terms_version|to_text|trim)
    }

    precondition ($tos_v != "") {
      error_type = "inputerror"
      error = "terms_version required."
    }

    var $code {
      value = ($input.session_code|to_text|trim)
    }

    precondition ($code != "") {
      error_type = "inputerror"
      error = "session_code required."
    }

    db.query wwl_slot {
      where = ($db.wwl_slot.session_code == $code) && ($db.wwl_slot.status == "open") && ($db.wwl_slot.sales_open == true)
      return = {type: "list"}
    } as $open_slots

    var $slot {
      value = null
    }

    var $best_sort {
      value = 999999
    }

    foreach ($open_slots) {
      each as $row {
        var $ord {
          value = ($row|get:"sort_order"|to_int)|first_notempty:999998
        }

        conditional {
          if (($slot == null) || ($ord < $best_sort)) {
            var.update $slot {
              value = $row
            }

            var.update $best_sort {
              value = $ord
            }
          }
        }
      }
    }

    precondition ($slot != null) {
      error_type = "notfound"
      error = "No spots available."
    }

    var $codename {
      value = ($slot|get:"spot_codename"|to_text|trim)
    }

    var $slot_ref {
      value = ($slot|get:"slot_ref"|to_text|trim)|first_notempty:($code ~ "·" ~ $codename)
    }

    var $event_key {
      value = ($slot|get:"mmi_event_key"|to_text|trim)|first_notempty:"luxe-estate-2026-oct"
    }

    var $estate_date {
      value = $slot|get:"estate_date"
    }

    var $balance_due {
      value = $estate_date|transform_timestamp:"-10 days"
    }

    // SKU list for checkout_lines_json + Stripe
    var $sku_list {
      value = ["WWL-DEPOSIT-710"]
    }

    conditional {
      if ($pay_type == "full") {
        var.update $sku_list {
          value = ["WWL-DEPOSIT-710", "WWL-ESTATE-BALANCE-710"]
        }
      }
    }

    conditional {
      if ($chalet == true) {
        var.update $sku_list {
          value = $sku_list|push:"WWL-CHALET-PREORDER-1420"
        }
      }
    }

    var $price_ids {
      value = []
    }

    foreach ($sku_list) {
      each as $sku {
        var $sku_code {
          value = $sku|to_text|trim
        }

        db.query wwl_stripe_sku {
          where = ($db.wwl_stripe_sku.sku == $sku_code) && ($db.wwl_stripe_sku.active == true)
          return = {type: "single"}
        } as $sku_row

        precondition ($sku_row != null) {
          error_type = "inputerror"
          error = "Missing active SKU row: " ~ $sku_code
        }

        var.update $price_ids {
          value = $price_ids|push:($sku_row|get:"stripe_price_id"|to_text|trim)
        }
      }
    }

    db.add wwl_consent_log {
      data = {
        uuid          : $consent_uuid
        consent_type  : "tos_booking"
        tos_version   : $tos_v
        accepted_at   : now
        email         : $input.parent_email
        parent_name   : $input.parent_name
        senior_name   : $input.senior_name
        slot_ref      : $slot_ref
        wwl_slot_id   : $slot|get:"id"|to_int
        ip_address    : $ip_address
        user_agent    : $user_agent
        page_url      : "wwl/book"
      }
    } as $consent_row

    var $origin {
      value = ($env.WWL_PUBLIC_ORIGIN|to_text|trim)|first_notempty:"https://whisperingwoodsluxe.com"
    }

    // Stripe rejects success_url when ref contains middle-dot (·) unencoded
    var $slot_ref_query {
      value = $slot_ref|url_encode
    }

    var $success_url {
      value = ($input.success_url|to_text|trim)|first_notempty:($origin ~ "/booked?ref=" ~ $slot_ref_query)
    }

    var $cancel_url {
      value = ($input.cancel_url|to_text|trim)|first_notempty:($origin ~ "/booked?cancelled=1")
    }

    // Guest Checkout: customer_email only — never customer_update (Stripe 400 without customer=cus_…).
    var $stripe_params {
      value = {}
        |set:"mode":"payment"
        |set:"success_url":$success_url
        |set:"cancel_url":$cancel_url
        |set:"customer_email":($input.parent_email|to_text|trim)
        |set:"payment_intent_data[receipt_email]":($input.parent_email|to_text|trim)
        |set:"metadata[mmi_brand]":"wwluxe"
        |set:"metadata[mmi_lane]":"wwluxe_estate_booking"
        |set:"metadata[mmi_event_key]":$event_key
        |set:"metadata[wwl_slot_id]":($slot|get:"id"|to_text)
        |set:"metadata[slot_ref]":$slot_ref
        |set:"metadata[session_code]":$code
        |set:"metadata[estate_payment_type]":$pay_type
        |set:"metadata[includes_chalet]":($chalet|to_text)
        |set:"metadata[terms_version]":$tos_v
        |set:"metadata[tos_consent_id]":($consent_row|get:"id"|to_text)
        |set:"metadata[consent_uuid]":$consent_uuid
        |set:"metadata[product_type]":"estate_checkout"
        |set:"automatic_tax[enabled]":"true"
        |set:"billing_address_collection":"required"
        |set:"shipping_address_collection[allowed_countries][0]":"US"
    }

    // IL performance on deposit/balance line_items: STRIPE_TAX_WYOMING.md · WWLUXE_TAX_IL_PERFORMANCE_JSON (Xano v2)

    // Stripe line_items[0..2] from $price_ids
    var $idx {
      value = 0
    }

    foreach ($price_ids) {
      each as $pid {
        var $key_price {
          value = "line_items[" ~ ($idx|to_text) ~ "][price]"
        }

        var $key_qty {
          value = "line_items[" ~ ($idx|to_text) ~ "][quantity]"
        }

        var.update $stripe_params {
          value = $stripe_params|set:$key_price:$pid|set:$key_qty:"1"
        }

        var.update $idx {
          value = $idx + 1
        }
      }
    }

    // Operator smoke only: WWLUXE_ALLOW_PROMOTION_CODES=true → promo field (Method B). Unset env + re-paste before launch. Do not set WWLUXE_SMOKE_COUPON_ID (conflicts with Stripe).
    var $promo_codes_on {
      value = (($env.WWLUXE_ALLOW_PROMOTION_CODES|to_text|to_lower) == "true") || (($env.WWLUXE_ALLOW_PROMOTION_CODES|to_text) == "1")
    }

    conditional {
      if ($promo_codes_on) {
        var.update $stripe_params {
          value = $stripe_params|set:"allow_promotion_codes":"true"
        }
      }
    }

    api.request {
      url = "https://api.stripe.com/v1/checkout/sessions"
      method = "POST"
      headers = []
        |push:("Authorization: Bearer " ~ ($env.WWL_STRIPE_SECRET_KEY|to_text))
        |push:"Content-Type: application/x-www-form-urlencoded"
      params = $stripe_params
    } as $stripe_raw

    var $stripe_body {
      value = ($stripe_raw|get:"response"|get:"result") ?? ($stripe_raw|get:"body") ?? $stripe_raw
    }

    var $session_url {
      value = ($stripe_body|get:"url"|to_text|trim)
    }

    var $session_id {
      value = ($stripe_body|get:"id"|to_text|trim)
    }

    var $stripe_err {
      value = ($stripe_body|get:"error"|get:"message"|to_text|trim)
    }

    precondition ($session_url != "") {
      error_type = "inputerror"
      error = ($stripe_err|first_notempty:"Stripe checkout session failed.")
    }

    db.edit wwl_consent_log {
      field_name = "id"
      field_value = $consent_row|get:"id"|to_int
      data = {stripe_session_id: $session_id}
    } as $consent_linked

    // Hold seat only when Checkout session exists (not on Stripe failure / no URL).
    db.edit wwl_slot {
      field_name = "id"
      field_value = $slot|get:"id"|to_int
      data = {
        status                      : "pending_checkout"
        parent_name                 : $input.parent_name
        parent_email                : $input.parent_email
        parent_phone                : $input.parent_phone
        senior_name                 : $input.senior_name
        estate_payment_type         : $pay_type
        includes_chalet             : $chalet
        terms_version               : $tos_v
        tos_consent_id              : $consent_row|get:"id"|to_int
        balance_due_date            : $balance_due
        checkout_lines_json         : $sku_list
        initial_checkout_session_id : $session_id
        updated_at                  : now
      }
    } as $slot_claimed
  }

  response = {
    checkout_url : $session_url
    session_id   : $session_id
    slot_ref     : $slot_ref
    consent_uuid : $consent_uuid
    sku_list     : $sku_list
  }
}
