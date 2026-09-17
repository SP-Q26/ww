// POST wwl/schedule/t10 — balance due (deposit path) · v1 = Checkout link per slot
// API group: wwl_ops · auth: NONE · header X-Cron-Secret = $env.WWL_CRON_SECRET
// Cron: daily · charges WWL-ESTATE-BALANCE-710 only (see estate-checkout-lines lineBalanceAtT10)

query "wwl/schedule/t10" verb=POST {
  api_group = "wwl_ops"

  input {
    text session_code? filters=trim
    date as_of?
  }

  stack {
    var $cron_secret {
      value = ($env.$http_headers|get:"x-cron-secret"|to_text|trim)|first_notempty:($env.$http_headers|get:"X-Cron-Secret"|to_text|trim)
    }

    var $cron_env {
      value = ($env.WWL_CRON_SECRET|to_text|trim)
    }

    var $cron_ok {
      value = true
    }

    conditional {
      if ($cron_env != "") {
        var.update $cron_ok {
          value = ($cron_secret == $cron_env)
        }
      }
    }

    precondition ($cron_ok == true) {
      error_type = "accessdenied"
      error = "Invalid cron secret."
    }

    var $today {
      value = ($input.as_of|first_notempty:(now|format_timestamp:"Y-m-d":"UTC"))
    }

    var $code_filter {
      value = ($input.session_code|to_text|trim)
    }

    conditional {
      if ($code_filter != "") {
        db.query wwl_slot {
          where = ($db.wwl_slot.session_code == $code_filter) && ($db.wwl_slot.estate_payment_type == "deposit") && ($db.wwl_slot.status == "deposit_paid") && ($db.wwl_slot.paid_balance_at == null) && ($db.wwl_slot.balance_due_date <= $today)
          return = {type: "list"}
        } as $due_rows
      }

      else {
        db.query wwl_slot {
          where = ($db.wwl_slot.estate_payment_type == "deposit") && ($db.wwl_slot.status == "deposit_paid") && ($db.wwl_slot.paid_balance_at == null) && ($db.wwl_slot.balance_due_date <= $today)
          return = {type: "list"}
        } as $due_rows
      }
    }

    var $results {
      value = []
    }

    db.query wwl_stripe_sku {
      where = $db.wwl_stripe_sku.sku == "WWL-ESTATE-BALANCE-710"
      return = {type: "single"}
    } as $balance_sku

    precondition ($balance_sku != null) {
      error_type = "inputerror"
      error = "Seed WWL-ESTATE-BALANCE-710 in wwl_stripe_sku."
    }

    var $balance_price {
      value = ($balance_sku|get:"stripe_price_id"|to_text|trim)
    }

    foreach ($due_rows) {
      each as $slot_row {
          var $slot_id {
            value = $slot_row|get:"id"|to_int
          }

          var $slot_ref {
            value = ($slot_row|get:"slot_ref"|to_text|trim)
          }

          var $email {
            value = ($slot_row|get:"parent_email"|to_text|trim)
          }

          api.request {
            url = "https://api.stripe.com/v1/checkout/sessions"
            method = "POST"
            headers = []
              |push:("Authorization: Bearer " ~ ($env.WWL_STRIPE_SECRET_KEY|to_text))
              |push:"Content-Type: application/x-www-form-urlencoded"
            params = {}
              |set:"mode":"payment"
              |set:"customer_email":$email
              |set:"success_url":("https://whisperingwoodsluxe.com/booked?balance_paid=1&ref=" ~ $slot_ref)
              |set:"cancel_url":"https://whisperingwoodsluxe.com/booked?cancelled=1"
              |set:"line_items[0][price]":$balance_price
              |set:"line_items[0][quantity]":"1"
              |set:"metadata[mmi_lane]":"wwluxe_estate_booking"
              |set:"metadata[product_type]":"estate_balance_t10"
              |set:"metadata[wwl_slot_id]":($slot_id|to_text)
              |set:"metadata[slot_ref]":$slot_ref
              |set:"metadata[estate_payment_type]":"deposit"
              |set:"automatic_tax[enabled]":"true"
          } as $stripe_raw

          var $stripe_body {
            value = ($stripe_raw|get:"response"|get:"result") ?? ($stripe_raw|get:"body") ?? $stripe_raw
          }

          var.update $results {
            value = $results|push:{
              slot_ref    : $slot_ref
              slot_id     : $slot_id
              checkout_url: ($stripe_body|get:"url"|to_text|trim)
              session_id  : ($stripe_body|get:"id"|to_text|trim)
            }
          }

          db.edit wwl_slot {
            field_name = "id"
            field_value = $slot_id
            data = {
              status : "balance_due"
              updated_at : now
            }
          } as $marked_due
      }
    }
  }

  response = {
    as_of   : $today
    count   : $results|count
    charges : $results
  }
}
