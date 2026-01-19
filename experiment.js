(function () {
  var EXP = "cro_o2_s25_online_exclusive_final_v9";
  if (window[EXP]) return;
  window[EXP] = true;

  var ATTR = "data-" + EXP;

  // ✅ Final destination for injected "Choose this plan" (same for both capacities)
  var CHOOSE_PLAN_URL =
    "https://www.o2.co.uk/shop/device/configuration?device-offering-id=1SAP156SLN&contract-type=Custom%20Plan%20with%20CCA&delivery-method-type=Home%20delivery&device-upfront=30&device-term=36&plan-offering-id=2025CPH72%3AUnl%3A1";

  // 100/75GB first, then Unlimited
  var TARIFFS = {
    "128": [
      { allowance: "100GB", upfront: 30.0, monthly: 38.31, device: 21.36, airtime: 16.95 },
      { allowance: "Unlimited", upfront: 30.0, monthly: 45.31, device: 21.36, airtime: 23.95 }
    ],
    "256": [
      { allowance: "75GB", upfront: 30.0, monthly: 48.0, device: 23.03, airtime: 24.97 },
      { allowance: "Unlimited", upfront: 30.0, monthly: 52.3, device: 23.03, airtime: 29.27 }
    ]
  };

  var OFFER_TITLE = "Get the Galaxy S25 for an exclusive low price. Ends 31 January.";
  var OFFER_BAR_TEXT = OFFER_TITLE;

  function to2(n) { return Number(n).toFixed(2); }
  function money(n) { return "£" + to2(n); }

  function isVisible(el) {
    if (!el) return false;
    if (el.closest("div[" + ATTR + "='true']")) return false;
    var s = window.getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function getCapacity() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("button,a"))
      .filter(function (el) { return /128GB|256GB/i.test((el.textContent || "").trim()); });

    var active = nodes.find(function (el) {
      var cls = (el.className || "").toLowerCase();
      return el.getAttribute("aria-pressed") === "true" ||
        el.getAttribute("aria-selected") === "true" ||
        cls.indexOf("active") > -1 ||
        cls.indexOf("selected") > -1;
    });

    var t = (active ? active.textContent : "").trim();
    if (/128/.test(t)) return "128";
    if (/256/.test(t)) return "256";

    // fallback
    return /128GB/i.test(document.body.innerText || "") ? "128" : "256";
  }

  // Baseline (real) tariff column: first visible "Choose this plan" NOT inside injected cards
  function firstVisibleTariffCol() {
    var btn = Array.prototype.slice.call(document.querySelectorAll("button"))
      .find(function (el) {
        var txt = ((el.textContent || "") + " " + (el.getAttribute("aria-label") || ""))
          .replace(/\s+/g, " ").trim();
        return /choose this plan/i.test(txt) && isVisible(el);
      });

    if (!btn) return null;
    return btn.closest("div[class*='col-lg-4']") || btn.closest("div");
  }

  function baselineInnerHeight() {
    var col = firstVisibleTariffCol();
    if (!col) return null;
    var card = col.querySelector("o2uk-commercial-tariff-card") || col;
    var inner = card.querySelector(".new-tariff-card__container");
    if (!inner) return null;
    var h = inner.getBoundingClientRect().height;
    return h || null;
  }

  
  function dispatchClick(el) {
    if (!el) return false;

    try { el.scrollIntoView({ block: "center", inline: "nearest" }); } catch (e) {}

    var rect = el.getBoundingClientRect();
    var x = rect.left + Math.min(10, rect.width / 2);
    var y = rect.top + Math.min(10, rect.height / 2);

    var evOpts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };

    try { el.dispatchEvent(new PointerEvent("pointerdown", Object.assign({ pointerType: "mouse" }, evOpts))); } catch (e) {}
    el.dispatchEvent(new MouseEvent("mousedown", evOpts));
    try { el.dispatchEvent(new PointerEvent("pointerup", Object.assign({ pointerType: "mouse" }, evOpts))); } catch (e) {}
    el.dispatchEvent(new MouseEvent("mouseup", evOpts));
    el.dispatchEvent(new MouseEvent("click", evOpts));

    return true;
  }

  // ---------- Remove injected ----------
  function removeInjected() {
    Array.prototype.slice.call(document.querySelectorAll("div[" + ATTR + "='true']")).forEach(function (n) {
      n.remove();
    });
  }

  // ---------- Native trigger fallbacks (for offer + benefit popups only) ----------
  function findNativeOfferTriggerBtn() {
    return Array.prototype.slice.call(document.querySelectorAll("button.new-tariff-promo-block-primary__container"))
      .find(isVisible) || null;
  }

  function findNativePlanInfoBtn() {
    return Array.prototype.slice.call(document.querySelectorAll(".price-rise-link button[data-id='see-plan-information']"))
      .find(isVisible) || null;
  }

  function findNativeRoamInfoBtn() {
    var all = Array.prototype.slice.call(document.querySelectorAll("button[aria-label='Show offer info']"))
      .filter(isVisible);

    if (!all.length) return null;

    var roam = all.find(function (btn) {
      var offerRow = btn.closest(".new-tariff-promo-block-benefits__offer");
      var txt = offerRow ? (offerRow.textContent || "") : "";
      return /roam freely/i.test(txt);
    });

    return roam || all[0];
  }

  // ---------- Offer popup content ----------
  function offerBodyHtml() {
    var linkHtml =
      '<a href="https://www.o2.co.uk/termsandconditions" target="_blank">' +
      'o2.co.uk/termsandconditions' +
      '<span class="sr-only" style="position: absolute !important;">&nbsp;Opens in new tab</span>' +
      "</a>";

    var p1 =
      "Data allowances must be used within the month and cannot be carried over, unless eligible for data rollover. " +
      "Subject to availability. Ends 31 January 2026.";

    var p2 =
      "UK calls/texts to standard UK landlines and mobiles and when roaming in our Europe Zone. Europe Zone data only. " +
      "Fair usage policy applies. Special and out of bundle numbers chargeable.";

    var p3 =
      "O2 Refresh custom plans: Direct purchases only. Pay the cash price for your device or spread the cost over 3 to 36 months (excludes dongles). " +
      "The device cost will be the same whatever you choose. There may be an upfront cost. You can pay off your Device Plan at any time and choose to keep your Airtime Plan, upgrade it, or leave. " +
      "If you are in the first 24 months of your Device Plan and you cancel your Airtime Plan you will have to pay the remainder of your Device Plan in full. " +
      "After 24 months you can keep your Airtime Plan, upgrade it, or end it without affecting your Device Plan.";

    var p4 =
      "UK data only. Fair Usage policy applies. Devices are subject to availability. 0% APR. Finance subject to status and credit checks. 18+. Direct Debit. " +
      "Credit provided by Telefonica UK Ltd, RG2 6UU, UK. Telefonica UK is authorised and regulated by the FCA for consumer credit and insurance. " +
      "Terms apply, " + linkHtml + ".";

    return '<div class="cro-offer-body">' +
      "<p>" + p1 + "</p>" +
      "<p>" + p2 + "</p>" +
      "<p>" + p3 + "</p>" +
      "<p>" + p4 + "</p>" +
    "</div>";
  }

  function patchLatestO2Dialog(titleText, bodyHtml) {
    var overlay = document.querySelector(".cdk-overlay-container");
    if (!overlay) return false;

    var panes = overlay.querySelectorAll(".cdk-overlay-pane");
    if (!panes || !panes.length) return false;

    var pane = null;
    for (var i = panes.length - 1; i >= 0; i--) {
      if (panes[i].querySelector(".o2uk-dialog-container, .mat-dialog-container")) {
        pane = panes[i];
        break;
      }
    }
    if (!pane) return false;

    var dialog = pane.querySelector(".o2uk-dialog-container, .mat-dialog-container");
    if (!dialog) return false;

    var h1 = dialog.querySelector(".o2uk-dialog-title h1.h3, .o2uk-dialog-title h1");
    if (h1) h1.textContent = titleText;

    var osContent =
      dialog.querySelector(".o2uk-dialog-content .os-content") ||
      dialog.querySelector(".mat-dialog-content .os-content");

    if (!osContent) return false;

    Array.prototype.slice.call(osContent.querySelectorAll("img")).forEach(function (img) { img.remove(); });
    osContent.innerHTML = bodyHtml;

    return true;
  }

  function openOfferDialogNative(nativeTriggerBtn) {
    if (!nativeTriggerBtn) return;
    dispatchClick(nativeTriggerBtn);

    var mustContain = "Data allowances must be used within the month";
    var tries = 0;

    var tick = setInterval(function () {
      tries++;

      var ok = patchLatestO2Dialog(OFFER_TITLE, offerBodyHtml());

      var overlay = document.querySelector(".cdk-overlay-container");
      var dialog = overlay
        ? overlay.querySelector(".cdk-overlay-pane:last-child .o2uk-dialog-container, .cdk-overlay-pane:last-child .mat-dialog-container")
        : null;

      var bodyOk = false;
      if (dialog) {
        var osContent =
          dialog.querySelector(".o2uk-dialog-content .os-content") ||
          dialog.querySelector(".mat-dialog-content .os-content");
        if (osContent && (osContent.textContent || "").indexOf(mustContain) > -1) bodyOk = true;
      }

      if ((ok && bodyOk) || tries >= 30) clearInterval(tick);
    }, 120);
  }

  // ---------- Card mutation helpers ----------
  function setOnlineExclusiveRoof(card) {
    var roof = card.querySelector(".tariff-card__roof");
    if (roof) roof.textContent = "Online Exclusive";
  }

  function removeClassicPlanRow(card) {
    var typeWrap = card.querySelector(".new-tariff-card-plan-info__type-wrapper");
    if (typeWrap) typeWrap.remove();
  }

  function setAllowance(card, allowance) {
    var el = card.querySelector(".new-tariff-card-plan-info__allowance span");
    if (el) el.textContent = allowance;

    var fair = card.querySelector(".new-tariff-card-plan-info__fair-usage-link");
    if (fair) fair.style.display = /^Unlimited$/i.test(allowance) ? "" : "none";
  }

  function setUpfront(card, upfront) {
    var integer = card.querySelector(".new-tariff-price-block__prices_upfront .o2uk-price__amount-integer");
    var dec = card.querySelector(".new-tariff-price-block__prices_upfront .o2uk-price__amount-decimal span");
    if (integer) integer.textContent = String(Math.floor(upfront));
    if (dec) dec.textContent = ".00";
  }

  function setMonthly(card, monthly) {
    var monthlyInt = Math.floor(monthly);
    var monthlyDec = "." + Math.round((monthly - monthlyInt) * 100).toString().padStart(2, "0");

    var integer = card.querySelector(".new-tariff-price-block__prices_monthly .o2uk-price__amount-integer");
    var dec = card.querySelector(".new-tariff-price-block__prices_monthly .o2uk-price__amount-decimal span");
    if (integer) integer.textContent = " " + monthlyInt + " ";
    if (dec) dec.textContent = " " + monthlyDec + " ";
  }

  function setPriceRise(card, monthly) {
    Array.prototype.slice.call(card.querySelectorAll(".price-rise-item")).forEach(function (it) {
      var label = it.querySelector("span:first-child");
      var value = it.querySelector("span:last-child");
      if (!label || !value) return;

      var text = (label.textContent || "").trim();
      if (/Apr 2026/i.test(text)) value.textContent = money(monthly + 2.5);
      if (/Apr 2027/i.test(text)) value.textContent = money(monthly + 5.0);
    });
  }

  function setBreakdown(card, device, airtime) {
    var el = card.querySelector(".new-tariff-price-block__monthly-cost-amount div");
    if (el) el.textContent = "£" + to2(device) + " Device + £" + to2(airtime) + " Airtime";
  }

  function setOfferBlock(card) {
    var promoBtn = card.querySelector(".new-tariff-promo-block-primary__container");
    var title = card.querySelector(".new-tariff-promo-block-primary__title");
    if (!promoBtn || !title) return;

    promoBtn.style.backgroundColor = "#953698";
    title.innerHTML =
      '<span class="o2uk-icon-font icon-chevron-normal new-tariff-promo-block-primary__title-icon"></span> ' +
      OFFER_BAR_TEXT;

    promoBtn.onclick = function (e) {
      e.preventDefault();
      var trigger = findNativeOfferTriggerBtn();
      openOfferDialogNative(trigger);
    };
  }

  function setupBenefitsAccordion(card) {
    var header = card.querySelector(".mat-expansion-panel-header");
    var content = card.querySelector(".o2uk-expansion-panel-content");
    var label = card.querySelector(".o2uk-inline-accordion__text");
    var body = card.querySelector(".new-tariff-promo-block-benefits__container");
    if (!header || !content || !label || !body) return;

    body.innerHTML =
      '<div class="new-tariff-promo-block-benefits__offer ng-star-inserted">' +
        '<p>Roam freely in the EU, up to 25GB.</p>' +
        '<o2uk-link svgid="icon-info-roundel" wrapperclass="new-tariff-promo-block-benefits__offer-button" svgclass="o2uk-link-svg_no_margin" class="o2uk-link__container ng-star-inserted">' +
          '<button type="button" class="new-tariff-promo-block-benefits__offer-button o2uk-link o2uk-link-svg_margin_right o2uk-link-svg_right o2uk-link_size_large ng-star-inserted" aria-label="Show offer info" aria-haspopup="dialog" ' + ATTR + '-benefit-info="1">' +
            '<span class="o2uk-icon-font o2uk-link-svg icon-info-roundel o2uk-link-svg_l o2uk-link-svg_no_margin ng-star-inserted"></span>' +
          '</button>' +
        '</o2uk-link>' +
      '</div>' +
      '<div class="new-tariff-promo-block-benefits__offer ng-star-inserted">Unlimited UK mins &amp; texts</div>';

    function setExpanded(expanded) {
      header.setAttribute("aria-expanded", expanded ? "true" : "false");
      label.textContent = expanded ? "Hide benefits" : "View (2) benefits";

      content.classList.remove("o2uk-expansion-panel-content_init-modal");
      content.style.display = expanded ? "block" : "none";
      content.style.height = expanded ? "auto" : "0px";
      content.style.visibility = expanded ? "visible" : "hidden";
      content.style.overflow = expanded ? "visible" : "hidden";

      var icon = header.querySelector(".o2uk-panel-icon");
      if (icon) icon.style.transform = expanded ? "rotate(180deg)" : "rotate(0deg)";
    }

    setExpanded(false);

    if (header.getAttribute(ATTR + "-wired") !== "1") {
      header.setAttribute(ATTR + "-wired", "1");
      header.addEventListener("click", function (e) {
        e.preventDefault();
        var open = header.getAttribute("aria-expanded") === "true";
        setExpanded(!open);
      });
    }

    var infoBtn = body.querySelector("button[" + ATTR + "-benefit-info='1']");
    if (infoBtn && infoBtn.getAttribute(ATTR + "-wired") !== "1") {
      infoBtn.setAttribute(ATTR + "-wired", "1");
      infoBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var roam = findNativeRoamInfoBtn();
        if (roam) dispatchClick(roam);
      });
    }
  }

  function wirePlanInfo(card) {
    var btn = card.querySelector(".price-rise-link button[data-id='see-plan-information']");
    if (!btn) return;

    btn.onclick = function (e) {
      e.preventDefault();
      var nativeBtn = findNativePlanInfoBtn();
      if (nativeBtn) dispatchClick(nativeBtn);
    };
  }

  // ✅ FINAL: Injected "Choose this plan" goes directly to CHOOSE_PLAN_URL (no native popup trigger)
  function wireChoose(card) {
    var btn =
      card.querySelector("button[aria-label*='Choose this plan']") ||
      Array.prototype.slice.call(card.querySelectorAll("button")).find(function (b) {
        return /choose this plan/i.test((b.textContent || "").trim());
      });

    if (!btn) return;

    btn.onclick = function (e) {
      e.preventDefault();
      window.location.assign(CHOOSE_PLAN_URL);
    };
  }

  function ensureMinHeight(card, h) {
    if (!h) return;
    var inner = card.querySelector(".new-tariff-card__container");
    if (inner) inner.style.minHeight = h + "px";
  }

  function updateClone(colEl, t, baselineH) {
    colEl.setAttribute(ATTR, "true");
    colEl.classList.add("cro-o2-injected");

    var card = colEl.querySelector("o2uk-commercial-tariff-card") || colEl;

    setOnlineExclusiveRoof(card);
    removeClassicPlanRow(card);

    setAllowance(card, t.allowance);
    setUpfront(card, t.upfront);
    setMonthly(card, t.monthly);
    setPriceRise(card, t.monthly);
    setBreakdown(card, t.device, t.airtime);

    setOfferBlock(card);
    setupBenefitsAccordion(card);

    wirePlanInfo(card);
    wireChoose(card);

    ensureMinHeight(card, baselineH);
  }

  var lastCap = null;
  var running = false;

  function render() {
    if (running) return;
    running = true;

    try {
      var cap = getCapacity();
      var tariffs = TARIFFS[cap];
      if (!tariffs) return;

      var baseCol = firstVisibleTariffCol();
      if (!baseCol) return;

      var baselineH = baselineInnerHeight();

      var injectedCount = document.querySelectorAll("div[" + ATTR + "='true']").length;
      if (lastCap === cap && injectedCount === 2) return;

      removeInjected();

      var frag = document.createDocumentFragment();
      tariffs.forEach(function (t) {
        var clone = baseCol.cloneNode(true);
        updateClone(clone, t, baselineH);
        frag.appendChild(clone);
      });

      baseCol.parentNode.insertBefore(frag, baseCol);
      lastCap = cap;
    } catch (e) {
      console.error(EXP, e);
    } finally {
      running = false;
    }
  }

  var tmr = null;
  function schedule() {
    clearTimeout(tmr);
    tmr = setTimeout(render, 200);
  }

  // bootstrap
  var tries = 0;
  var poll = setInterval(function () {
    tries++;
    schedule();
    if (firstVisibleTariffCol() || tries >= 60) clearInterval(poll);
  }, 350);

  // capacity click handling
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("button,a") : null;
    if (!el) return;
    var t = (el.textContent || "").trim();
    if (/128GB|256GB/i.test(t)) schedule();
  }, true);

  // watch Angular rerenders
  var obs = new MutationObserver(function () { schedule(); });
  obs.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
