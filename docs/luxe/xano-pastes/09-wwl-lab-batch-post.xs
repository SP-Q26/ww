// POST wwl/lab/batch — update lab batch status / tracking
// API group: wwl_ops · X-API-Key
// SPQ: db.edit data = { } literal only

query "wwl/lab/batch" verb=POST {
  api_group = "wwl_ops"

  input {
    int id
    text status? filters=trim
    text tracking? filters=trim
    json cart_template_json?
    int wholesale_cents?
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

    db.get wwl_lab_batch {
      field_name = "id"
      field_value = $input.id|to_int
    } as $batch

    precondition ($batch != null) {
      error_type = "notfound"
      error = "Batch not found."
    }

    var $status_in {
      value = ($input.status|to_text|trim)
    }

    var $tracking_in {
      value = ($input.tracking|to_text|trim)
    }

    var $saved {
      value = $batch
    }

    conditional {
      if ($status_in != "") {
        conditional {
          if ($status_in == "submitted") {
            db.edit wwl_lab_batch {
              field_name = "id"
              field_value = $input.id|to_int
              data = {
                updated_at   : now
                status       : $status_in
                submitted_at : now
              }
            } as $saved
          }

          else {
            db.edit wwl_lab_batch {
              field_name = "id"
              field_value = $input.id|to_int
              data = {
                updated_at : now
                status     : $status_in
              }
            } as $saved
          }
        }
      }
    }

    conditional {
      if ($tracking_in != "") {
        db.edit wwl_lab_batch {
          field_name = "id"
          field_value = $input.id|to_int
          data = {
            updated_at : now
            tracking   : $tracking_in
          }
        } as $saved
      }
    }

    conditional {
      if ($input.cart_template_json != null) {
        db.edit wwl_lab_batch {
          field_name = "id"
          field_value = $input.id|to_int
          data = {
            updated_at          : now
            cart_template_json  : $input.cart_template_json
          }
        } as $saved
      }
    }

    conditional {
      if ($input.wholesale_cents != null) {
        db.edit wwl_lab_batch {
          field_name = "id"
          field_value = $input.id|to_int
          data = {
            updated_at       : now
            wholesale_cents  : $input.wholesale_cents|to_int
          }
        } as $saved
      }
    }
  }

  response = {
    ok    : true
    batch : $saved
  }
}
