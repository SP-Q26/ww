// POST wwl/slots/batch — seed / flip sales_open / per-row ops patches
// API group: wwl_ops · auth: NONE · X-API-Key
// SPQ: db.edit data = { } literal — not data = $variable

query "wwl/slots/batch" verb=POST {
  api_group = "wwl_ops"

  input {
    text session_code filters=trim
    bool sales_open?
    text session_label? filters=trim
    date estate_date?
    json slots?
  }

  stack {
    var $api_key {
      value = ($env.$http_headers|get:"x-api-key"|to_text|trim)|first_notempty:($env.$http_headers|get:"X-API-Key"|to_text|trim)
    }

    var $ops_key_env {
      value = ($env.WWL_OPS_API_KEY|to_text|trim)
    }

    var $ops_key_ok {
      value = true
    }

    conditional {
      if ($ops_key_env != "") {
        var.update $ops_key_ok {
          value = ($api_key == $ops_key_env)
        }
      }
    }

    precondition ($ops_key_ok == true) {
      error_type = "accessdenied"
      error = "Invalid ops API key."
    }

    var $code {
      value = ($input.session_code|to_text|trim)
    }

    precondition ($code != "") {
      error_type = "inputerror"
      error = "session_code required."
    }

    var $updated {
      value = 0
    }

    var $label_in {
      value = ($input.session_label|to_text|trim)
    }

    db.query wwl_slot {
      where = $db.wwl_slot.session_code == $code
      return = {type: "list"}
    } as $session_rows

    conditional {
      if ($input.sales_open != null) {
        foreach ($session_rows) {
          each as $slot_row {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_row|get:"id"|to_int
              data = {
                updated_at : now
                sales_open   : $input.sales_open
              }
            } as $edited_sales

            var.update $updated {
              value = $updated + 1
            }
          }
        }
      }
    }

    conditional {
      if ($label_in != "") {
        foreach ($session_rows) {
          each as $slot_row {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_row|get:"id"|to_int
              data = {
                updated_at    : now
                session_label : $label_in
              }
            } as $edited_label

            var.update $updated {
              value = $updated + 1
            }
          }
        }
      }
    }

    conditional {
      if ($input.estate_date != null) {
        foreach ($session_rows) {
          each as $slot_row {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_row|get:"id"|to_int
              data = {
                updated_at  : now
                estate_date : $input.estate_date
              }
            } as $edited_date

            var.update $updated {
              value = $updated + 1
            }
          }
        }
      }
    }

    var $slot_patches {
      value = ($input.slots|safe_array)
    }

    foreach ($slot_patches) {
      each as $one {
        var $ref {
          value = ($one|get:"slot_ref"|to_text|trim)
        }

        precondition ($ref != "") {
          error_type = "inputerror"
          error = "Each slots[] entry needs slot_ref."
        }

        db.query wwl_slot {
          where = ($db.wwl_slot.session_code == $code) && ($db.wwl_slot.slot_ref == $ref)
          return = {type: "single"}
        } as $target

        precondition ($target != null) {
          error_type = "notfound"
          error = "slot_ref not found: " ~ $ref
        }

        var $slot_id {
          value = $target|get:"id"|to_int
        }

        var $tb {
          value = ($one|get:"time_block"|to_text|trim)
        }

        var $zone {
          value = ($one|get:"photographer_zone"|to_text|trim)
        }

        var $st {
          value = ($one|get:"status"|to_text|trim)
        }

        conditional {
          if ($tb != "") {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_id
              data = {
                updated_at : now
                time_block : $tb
              }
            } as $edited_tb

            var.update $updated {
              value = $updated + 1
            }
          }
        }

        conditional {
          if ($zone != "") {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_id
              data = {
                updated_at        : now
                photographer_zone : $zone
              }
            } as $edited_zone

            var.update $updated {
              value = $updated + 1
            }
          }
        }

        conditional {
          if ($st != "") {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_id
              data = {
                updated_at : now
                status     : $st
              }
            } as $edited_st

            var.update $updated {
              value = $updated + 1
            }
          }
        }

        conditional {
          if ($one|get:"hmua_done" != null) {
            db.edit wwl_slot {
              field_name = "id"
              field_value = $slot_id
              data = {
                updated_at : now
                hmua_done  : $one|get:"hmua_done"
              }
            } as $edited_hmua

            var.update $updated {
              value = $updated + 1
            }
          }
        }
      }
    }
  }

  response = {
    session_code : $code
    updated      : $updated
    ok           : true
  }
}
