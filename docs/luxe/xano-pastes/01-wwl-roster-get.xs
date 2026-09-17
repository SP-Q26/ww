// GET wwl/roster — public scarcity for WeWeb
// API group: wwl_ops · auth: NONE
// SPQ pattern: filter in db.query where — no foreach + compound if

query "wwl/roster" verb=GET {
  api_group = "wwl_ops"

  input {
    text session_code filters=trim
  }

  stack {
    var $code {
      value = ($input.session_code|to_text|trim)|first_notempty:"01-Fall"
    }

    db.query wwl_slot {
      where = $db.wwl_slot.session_code == $code
      return = {type: "list"}
    } as $all

    var $total {
      value = $all|count
    }

    db.query wwl_slot {
      where = ($db.wwl_slot.session_code == $code) && ($db.wwl_slot.status == "open") && ($db.wwl_slot.sales_open == true)
      return = {type: "list"}
    } as $open_rows

    var $open {
      value = $open_rows|count
    }

    db.query wwl_slot {
      where = $db.wwl_slot.session_code == $code
      return = {type: "single"}
    } as $sample

    var $session_label {
      value = ($sample|get:"session_label"|to_text|trim)
    }

    var $sales_open {
      value = ($sample|get:"sales_open") == true
    }

    var $estate_date {
      value = $sample|get:"estate_date"
    }
  }

  response = {
    session_code  : $code
    open          : $open
    total         : $total
    session_label : $session_label
    sales_open    : $sales_open
    estate_date   : $estate_date
  }
}
