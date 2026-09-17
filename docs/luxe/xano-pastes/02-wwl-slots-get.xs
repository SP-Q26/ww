// GET wwl/slots — operator read
// API group: wwl_ops · auth: NONE · gate: X-API-Key = $env.WWL_OPS_API_KEY

query "wwl/slots" verb=GET {
  api_group = "wwl_ops"

  input {
    text session_code? filters=trim
    text status? filters=trim
    int limit?
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

    var $status_f {
      value = ($input.status|to_text|trim)
    }

    var $lim {
      value = ($input.limit|to_int)|first_notempty:500
    }

    var $rows {
      value = []
    }

    conditional {
      if ($code != "") {
        conditional {
          if ($status_f != "") {
            db.query wwl_slot {
              where = ($db.wwl_slot.session_code == $code) && ($db.wwl_slot.status == $status_f)
              return = {type: "list"}
            } as $rows
          }

          else {
            db.query wwl_slot {
              where = $db.wwl_slot.session_code == $code
              return = {type: "list"}
            } as $rows
          }
        }
      }

      elseif ($status_f != "") {
        db.query wwl_slot {
          where = $db.wwl_slot.status == $status_f
          return = {type: "list"}
        } as $rows
      }

      else {
        db.query wwl_slot {
          return = {type: "list"}
        } as $rows
      }
    }

    var.update $rows {
      value = $rows|slice:0:$lim
    }
  }

  response = {
    count : $rows|count
    slots : $rows
  }
}
