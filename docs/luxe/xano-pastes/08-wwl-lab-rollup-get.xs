// GET wwl/lab/rollup — draft Red Tree rollup for session_code
// API group: wwl_ops · X-API-Key

query "wwl/lab/rollup" verb=GET {
  api_group = "wwl_ops"

  input {
    text session_code filters=trim
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
      value = ($input.session_code|to_text|trim)|first_notempty:"01-Fall"
    }

    db.query wwl_slot {
      where = ($db.wwl_slot.session_code == $code) && ($db.wwl_slot.paid_chalet_at != null)
      return = {type: "list"}
    } as $chalet_slots

    db.query wwl_order {
      where = ($db.wwl_order.status == "paid") || ($db.wwl_order.status == "fulfillment")
      return = {type: "list"}
    } as $orders_all

    var $album_count {
      value = 0
    }

    foreach ($orders_all) {
      each as $ord {
        var $lines {
          value = ($ord|get:"lines_json"|safe_array)
        }

        foreach ($lines) {
          each as $line {
            conditional {
              if (($line|get:"sku"|to_text) == "WWL-ALBUM-HEIRLOOM-955") {
                var.update $album_count {
                  value = $album_count + (($line|get:"qty"|to_int)|first_notempty:1)
                }
              }
            }
          }
        }
      }
    }

    var $rollup {
      value = {
        session_code   : $code
        generated_at   : now
        chalet_preorder: $chalet_slots|count
        album_orders   : $album_count
        notes          : "v1 rollup — extend with REDTREE_BOM_AUDIT wholesale lines"
      }
    }

    db.query wwl_lab_batch {
      where = ($db.wwl_lab_batch.session_code == $code) && ($db.wwl_lab_batch.status == "draft")
      return = {type: "single"}
    } as $draft

    conditional {
      if ($draft != null) {
        db.edit wwl_lab_batch {
          field_name = "id"
          field_value = $draft|get:"id"|to_int
          data = {
            rollup_json : $rollup
            updated_at  : now
          }
        } as $draft_saved
      }

      else {
        db.add wwl_lab_batch {
          data = {
            session_code : $code
            vendor       : "redtree"
            status       : "draft"
            rollup_json  : $rollup
          }
        } as $draft_saved
      }
    }
  }

  response = {
    session_code : $code
    rollup_json  : $rollup
    batch_id     : $draft_saved|get:"id"
  }
}
