/**
 * WW Luxe · Tour Booking Modal → Xano wwl/book → Stripe Checkout
 * Pattern: SPQ custom-code/index-stripe-payment-active.js
 *
 * WeWeb wf_booking_form_submit → custom-js:
 *   return await wwlBookingSubmitCheckout(event, context);
 */
(function (global) {
  'use strict';

  var XANO_BOOK = 'https://xfog-zdyr-rbyx.n7e.xano.io/api:E6ai6f3e/wwl/book';
  var TOS_VERSION = '2026-09-09';
  var SESSION_CODE = '01-Fall';

  var VAR_TOS = 'cf11c98d-0535-4846-b38f-cde7c2a851b1';
  var VAR_MODEL = '32e6b365-61d8-41ff-af58-18df2c8ce265';
  var VAR_PAY_TYPE = '8fdafead-7500-4044-a402-6886d5ea1bc5';
  var VAR_CHALET = '5905a400-d00d-42b5-b67f-fc9068786402';
  var VAR_BOOKING_SUBMITTED = '5998463a-9be2-4fd0-be63-75a4c5af9377';

  var EL_TOS = 'd42c5d99-90c6-439c-9212-b3649668b217-value';
  var EL_MODEL = 'a28dd2bd-1565-4a39-a6f7-cc9a1290baf6-value';
  var EL_SENIOR = '4e9f619f-fa9f-43e1-b529-7ca8a8ffa09f-value';
  var EL_PARENT = '3bfc609d-5c0e-4310-ade7-a0d6c5d454c1-value';
  var EL_MOM_EMAIL = '2c1c865e-16c3-4073-bf84-216f2a008701-value';
  var EL_PHONE = '1abe95d2-95d2-49cd-8b81-f73bebcbe1ba-value';

  function trim(v) {
    return String(v == null ? '' : v).trim();
  }

  // Component modal vars (e.g. bookingSubmitted) live on context.component — not project variables.
  var COMPONENT_VAR_IDS = {
    '5998463a-9be2-4fd0-be63-75a4c5af9377': true,
    'cf11c98d-0535-4846-b38f-cde7c2a851b1': true,
    '32e6b365-61d8-41ff-af58-18df2c8ce265': true,
    '8fdafead-7500-4044-a402-6886d5ea1bc5': true,
    '5905a400-d00d-42b5-b67f-fc9068786402': true,
  };

  function wwUpdate(ctx, varId, val) {
    if (COMPONENT_VAR_IDS[varId] && ctx && ctx.component && ctx.component.variables) {
      ctx.component.variables[varId] = val;
      return;
    }
    try {
      if (typeof variables !== 'undefined' && varId) variables[varId] = val;
    } catch (e) {}
    try {
      if (global.wwLib && global.wwLib.wwVariable && varId) {
        global.wwLib.wwVariable.updateValue(varId, val);
      }
    } catch (e2) {}
  }

  function compVars(ctx) {
    return (ctx && ctx.component && ctx.component.variables) || {};
  }

  function varGet(key) {
    if (!key) return '';
    try {
      if (typeof variables !== 'undefined' && variables[key] != null) {
        return variables[key];
      }
    } catch (e) {}
    return '';
  }

  function fieldVal(ev, formKey, elVarKey, comp, compVarId) {
    var t = trim((ev && ev[formKey]) || '');
    if (t) return t;
    if (compVarId && comp && comp[compVarId] != null) {
      t = trim(comp[compVarId]);
      if (t) return t;
    }
    t = trim(varGet(elVarKey));
    return t;
  }

  function legalOk(ev, comp) {
    var tos =
      !!(ev && ev.acceptTerms) ||
      !!comp[VAR_TOS] ||
      !!varGet(EL_TOS) ||
      !!varGet('d42c5d99-90c6-439c-9212-b3649668b217');
    var model =
      !!(ev && ev.acceptModelRelease) ||
      !!comp[VAR_MODEL] ||
      !!varGet(EL_MODEL) ||
      !!varGet('a28dd2bd-1565-4a39-a6f7-cc9a1290baf6');
    return tos && model;
  }

  function parseCheckoutUrl(data) {
    if (!data || typeof data !== 'object') return '';
    if (data.checkout_url) return trim(data.checkout_url);
    if (data.checkoutUrl) return trim(data.checkoutUrl);
    if (data.url) return trim(data.url);
    return '';
  }

  function origin() {
    try {
      if (global.location && global.location.origin) {
        return String(global.location.origin).replace(/\/$/, '');
      }
    } catch (e) {}
    return 'https://whisperingwoodsluxe.com';
  }

  async function wwlBookingSubmitCheckout(ev, ctx) {
    var comp = compVars(ctx);
    if (!legalOk(ev, comp)) return { ok: false, reason: 'legal_required' };

    wwUpdate(ctx, VAR_BOOKING_SUBMITTED, false);

    var payRaw = comp[VAR_PAY_TYPE] || varGet(VAR_PAY_TYPE) || 'deposit';
    var body = {
      session_code: SESSION_CODE,
      parent_name: fieldVal(ev, 'parentName', EL_PARENT, comp, null) || 'Parent / Guardian',
      parent_email: fieldVal(ev, 'momEmail', EL_MOM_EMAIL, comp, null),
      parent_phone: fieldVal(ev, 'phone', EL_PHONE, comp, null),
      senior_name: fieldVal(ev, 'seniorName', EL_SENIOR, comp, null),
      estate_payment_type: payRaw === 'full' ? 'full' : 'deposit',
      includes_chalet: !!(comp[VAR_CHALET] || varGet(VAR_CHALET)),
      terms_version: TOS_VERSION,
      success_url: origin() + '/booked',
      cancel_url: origin() + '/booked?cancelled=1',
    };

    if (!body.parent_email || !body.senior_name || !body.parent_phone) {
      wwUpdate(ctx, VAR_BOOKING_SUBMITTED, true);
      return { ok: false, reason: 'form_incomplete' };
    }

    var res;
    var data = {};
    try {
      res = await fetch(XANO_BOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(body),
      });
      try {
        data = await res.json();
      } catch (parseErr) {
        data = {};
      }
    } catch (netErr) {
      wwUpdate(ctx, VAR_BOOKING_SUBMITTED, true);
      return { ok: false, reason: 'network' };
    }

    var checkoutUrl = parseCheckoutUrl(data);
    if (!res.ok || !checkoutUrl) {
      wwUpdate(ctx, VAR_BOOKING_SUBMITTED, true);
      return {
        ok: false,
        status: res.status,
        message: (data && (data.message || data.error)) || 'checkout_failed',
      };
    }

    global.location.assign(checkoutUrl);
    return { ok: true, session_id: data.session_id };
  }

  global.wwlBookingSubmitCheckout = wwlBookingSubmitCheckout;

  // Home pill + modal counter — project variable 4e60cc52… (not component scope)
  var ROSTER_OPEN_VAR = '4e60cc52-8513-4e93-b3b8-af02bf2305b2';
  var ROSTER_URL =
    'https://xfog-zdyr-rbyx.n7e.xano.io/api:E6ai6f3e/wwl/roster?session_code=' +
    encodeURIComponent('01-Fall');

  async function wwlFetchRosterOpenCount() {
    var res = await fetch(ROSTER_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    });
    var data = {};
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (res.ok && data && typeof data.open === 'number') {
      try {
        if (typeof variables !== 'undefined') variables[ROSTER_OPEN_VAR] = data.open;
      } catch (e1) {}
      try {
        if (global.wwLib && global.wwLib.wwVariable) {
          global.wwLib.wwVariable.updateValue(ROSTER_OPEN_VAR, data.open);
        }
      } catch (e2) {}
    }
    return data;
  }

  global.wwlFetchRosterOpenCount = wwlFetchRosterOpenCount;
})(typeof window !== 'undefined' ? window : globalThis);
