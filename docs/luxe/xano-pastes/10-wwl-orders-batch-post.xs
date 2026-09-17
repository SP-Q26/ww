// POST wwl/orders/batch — operator status bumps on heirloom orders
// API group: wwl_ops · X-API-Key
// Body: { "orders": [{ "id": 1, "status": "shipped", "fulfillment_status": "lab" }] }

query "wwl/orders/batch" verb=POST {
  api_group = "wwl_ops"

  input {
    json orders
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

    var $list {
      value = ($input.orders|safe_array)
    }

    precondition (($list|count) > 0) {
      error_type = "inputerror"
      error = "orders[] required."
    }

    var $updated {
      value = 0
    }

    foreach ($list) {
      each as $one {
        var $oid {
          value = ($one|get:"id"|to_int)
        }

        precondition ($oid > 0) {
          error_type = "inputerror"
          error = "Each order needs id."
        }

        var $status_in {
          value = ($one|get:"status"|to_text|trim)
        }

        var $fulfill_in {
          value = ($one|get:"fulfillment_status"|to_text|trim)
        }

        conditional {
          if ($status_in != "") {
            db.edit wwl_order {
              field_name = "id"
              field_value = $oid
              data = {
                updated_at : now
                status     : $status_in
              }
            } as $saved_status

            var.update $updated {
              value = $updated + 1
            }
          }
        }

        conditional {
          if ($fulfill_in != "") {
            db.edit wwl_order {
              field_name = "id"
              field_value = $oid
              data = {
                updated_at          : now
                fulfillment_status  : $fulfill_in
              }
            } as $saved_fulfill

            var.update $updated {
              value = $updated + 1
            }
          }
        }
      }
    }
  }

  response = {
    ok      : true
    updated : $updated
  }
}
