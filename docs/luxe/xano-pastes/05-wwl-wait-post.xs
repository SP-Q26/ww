// POST wwl/wait — waitlist when sold out
// API group: wwl_ops · auth: NONE

query "wwl/wait" verb=POST {
  api_group = "wwl_ops"

  input {
    text session_code filters=trim
    email email
    text parent_name? filters=trim
    text senior_name? filters=trim
    text terms_version filters=trim
    bool marketing_consent?=true
  }

  stack {
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

    var $code {
      value = ($input.session_code|to_text|trim)
    }

    precondition ($code != "") {
      error_type = "inputerror"
      error = "session_code required."
    }

    var $tos_v {
      value = ($input.terms_version|to_text|trim)
    }

    precondition ($tos_v != "") {
      error_type = "inputerror"
      error = "terms_version required."
    }

    db.query wwl_wait {
      where = ($db.wwl_wait.session_code == $code) && ($db.wwl_wait.email == $input.email) && ($db.wwl_wait.status == "active")
      return = {type: "single"}
    } as $existing

    precondition ($existing == null) {
      error_type = "inputerror"
      error = "already_registered"
    }

    security.create_uuid as $uuid

    db.add wwl_wait {
      data = {
        uuid              : $uuid
        session_code      : $code
        email             : $input.email
        parent_name       : $input.parent_name
        senior_name       : $input.senior_name
        tos_version       : $tos_v
        marketing_consent : ($input.marketing_consent|first_notempty:true)
        ip_address        : $ip_address
        user_agent        : $user_agent
        status            : "active"
      }
    } as $row
  }

  response = {
    ok   : true
    uuid : $uuid
    id   : $row|get:"id"
  }
}
