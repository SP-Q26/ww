// POST wwl/stripe/webhook — checkout.session.completed
// API group: wwl_ops · auth: NONE
// Stripe Dashboard → checkout.session.completed → this URL

query "wwl/stripe/webhook" verb=POST {
  api_group = "wwl_ops"

  input {
    text stripe_signature? filters=trim
  }

  stack {
    util.get_all_input as $all_input

    util.get_raw_input {
      encoding = "json"
      exclude_middleware = false
    } as $raw_input

    var $event {
      value = {}
    }

    conditional {
      if (($all_input|get:"type"|to_text|trim) != "") {
        var.update $event {
          value = $all_input
        }
      }

      elseif ($raw_input|is_object) {
        var.update $event {
          value = $raw_input
        }
      }

      elseif (($raw_input|to_text|trim) != "") {
        var.update $event {
          value = ($raw_input|json_decode)
        }
      }
    }

    var $event_type {
      value = ($event|get:"type"|to_text|trim)
    }

    var $already_handled {
      value = false
    }

    conditional {
      if ($event_type == "checkout.session.completed") {
        var $obj {
          value = $event|get:"data"|get:"object"
        }

        var $session_id {
          value = ($obj|get:"id"|to_text|trim)
        }

        var $webhook_event_id {
          value = ($event|get:"id"|to_text|trim)
        }

        precondition ($session_id != "") {
          error_type = "inputerror"
          error = "Missing session id."
        }

        precondition (($obj|get:"payment_status"|to_text|to_lower) == "paid") {
          error_type = "inputerror"
          error = "Session not paid."
        }

        // Idempotency: session id only (SPQ webhook v3 pattern). Table must exist: wwl_payment_log.
        db.query wwl_payment_log {
          where = $db.wwl_payment_log.stripe_session_id == $session_id
          return = {type: "single"}
        } as $paid_log

        conditional {
          if ($paid_log != null) {
            var $prior_status {
              value = ($paid_log|get:"payment_status"|to_text|trim)
            }

            conditional {
              if ($prior_status == "succeeded") {
                var.update $already_handled {
                  value = true
                }
              }
            }
          }
        }

        conditional {
          if ($already_handled == false) {
            var $meta {
              value = $obj|get:"metadata"
            }

            var $slot_id {
              value = ($meta|get:"wwl_slot_id"|to_int)|first_notempty:0
            }

            var $slot_ref {
              value = ($meta|get:"slot_ref"|to_text|trim)
            }

            var $lane {
              value = ($meta|get:"mmi_lane"|to_text|trim)|first_notempty:"wwluxe_estate_booking"
            }

            var $pay_type {
              value = ($meta|get:"estate_payment_type"|to_text|to_lower|trim)
            }

            var $includes_chalet {
              value = (($meta|get:"includes_chalet"|to_text|to_lower) == "true")
            }

            var $tos_consent_id {
              value = ($meta|get:"tos_consent_id"|to_int)|first_notempty:0
            }

            var $terms_version {
              value = ($meta|get:"terms_version"|to_text|trim)
            }

            var $email {
              value = (($obj|get:"customer_details"|get:"email")|to_text|trim)|first_notempty:(($obj|get:"customer_email")|to_text|trim)
            }

            var $amount_cents {
              value = ($obj|get:"amount_total"|to_int)|first_notempty:0
            }

            var $tax_cents {
              value = ($obj|get:"total_details"|get:"amount_tax"|to_int)|first_notempty:0
            }

            var $meta_product_type {
              value = ($meta|get:"product_type"|to_text|trim)
            }

            var $product_type {
              value = "estate_checkout"
            }

            conditional {
              if ($meta_product_type == "estate_balance_t10") {
                var.update $product_type {
                  value = "estate_balance_t10"
                }
              }
            }

            conditional {
              if ($lane == "wwluxe_heirloom") {
                var.update $product_type {
                  value = "heirloom_checkout"
                }
              }
            }

            conditional {
              if ($lane == "wwluxe_keepsake") {
                var.update $product_type {
                  value = "heirloom_checkout"
                }
              }
            }

            security.create_uuid as $log_uuid

            var $stripe_customer {
              value = ($obj|get:"customer"|to_text|trim)
            }

            var $tos_id {
              value = $tos_consent_id|to_int
            }

            var $log_ip {
              value = ""
            }

            var $log_ua {
              value = ""
            }

            var $lines_json {
              value = {}
            }

            conditional {
              if ($tos_id > 0) {
                db.get wwl_consent_log {
                  field_name = "id"
                  field_value = $tos_id
                } as $consent_row

                conditional {
                  if ($consent_row != null) {
                    var.update $log_ip {
                      value = ($consent_row|get:"ip_address"|to_text|trim)
                    }

                    var.update $log_ua {
                      value = ($consent_row|get:"user_agent"|to_text|trim)
                    }
                  }
                }
              }
            }

            conditional {
              if ($slot_id > 0) {
                db.get wwl_slot {
                  field_name = "id"
                  field_value = $slot_id|to_int
                } as $slot_row

                conditional {
                  if ($slot_row != null) {
                    var $slot_lines {
                      value = $slot_row|get:"checkout_lines_json"
                    }

                    conditional {
                      if ($slot_lines != null) {
                        var.update $lines_json {
                          value = $slot_lines
                        }
                      }
                    }
                  }
                }
              }
            }

            db.add wwl_payment_log {
              enforce_hidden_fields = false
              data = {
                uuid                      : $log_uuid
                wwl_slot_id               : $slot_id
                slot_ref                  : $slot_ref
                email                     : $email
                stripe_session_id         : $session_id
                stripe_webhook_event_id   : $webhook_event_id
                stripe_payment_intent_id  : ($obj|get:"payment_intent"|to_text|trim)
                stripe_customer_id        : $stripe_customer
                mmi_lane                  : $lane
                mmi_event_key             : ($meta|get:"mmi_event_key"|to_text|trim)
                estate_payment_type       : $pay_type
                includes_chalet           : $includes_chalet
                product_type              : $product_type
                amount_cents              : $amount_cents
                amount_tax_cents          : $tax_cents
                currency                  : ($obj|get:"currency"|to_text|to_lower|trim)|first_notempty:"usd"
                payment_status            : "succeeded"
                terms_version             : $terms_version
                tos_consent_id            : $tos_id
                lines_json                : $lines_json
                ip_address                : $log_ip
                user_agent                : $log_ua
                day                       : now|format_timestamp:"Y-m-d":"UTC"
              }
            } as $plog

            conditional {
              if ($slot_id > 0) {
                conditional {
                  if ($meta_product_type == "estate_balance_t10") {
                    db.edit wwl_slot {
                      field_name = "id"
                      field_value = $slot_id|to_int
                      data = {
                        status          : "complete"
                        paid_balance_at : now
                        updated_at      : now
                      }
                    } as $slot_t10
                  }

                  else {
                    var $new_status {
                      value = "deposit_paid"
                    }

                    conditional {
                      if ($pay_type == "full") {
                        var.update $new_status {
                          value = "paid_in_full"
                        }
                      }
                    }

                    db.edit wwl_slot {
                      field_name = "id"
                      field_value = $slot_id|to_int
                      data = {
                        status                : $new_status
                        stripe_customer_id    : $stripe_customer
                        paid_deposit_at       : now
                        booked_at             : now
                        updated_at            : now
                      }
                    } as $slot_upd

                    conditional {
                      if ($pay_type == "full") {
                        db.edit wwl_slot {
                          field_name = "id"
                          field_value = $slot_id|to_int
                          data = {
                            paid_balance_at : now
                          }
                        } as $slot_bal
                      }
                    }

                    conditional {
                      if ($includes_chalet == true) {
                        db.edit wwl_slot {
                          field_name = "id"
                          field_value = $slot_id|to_int
                          data = {
                            paid_chalet_at : now
                          }
                        } as $slot_chalet
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  response = {
    ok              : true
    already_handled : $already_handled
    event_type      : $event_type
    stripe_session_id : ($event_type == "checkout.session.completed") ? (($event|get:"data"|get:"object"|get:"id"|to_text|trim)) : ""
  }
}
