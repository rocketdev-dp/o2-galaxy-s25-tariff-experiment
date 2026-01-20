# o2-galaxy-s25-tariff-experiment
Adds 2 capacity-based tariff cards before the existing grid using JS/CSS injection, reusing native components for visual parity.

# O2 Galaxy S25 – CRO Frontend Task (Tariff Injection)
This repo contains a self-contained JavaScript + CSS snippet to inject 2 “Online Exclusive” tariff cards before the existing tariff cards on the O2 Galaxy S25 PDP. The injected cards update based on selected capacity (128GB / 256GB) and remain responsive across breakpoints by reusing O2’s existing card structure.

---

## Test Page Used

**Primary test page:**
- https://www.o2.co.uk/shop/samsung/galaxy-s25-5g

> Note: The task PDF mentions a test URL with `?optimizely_disable=true`. In practice, that variant caused inconsistent behaviour during injection (DOM/behaviour differences impacted stability). The implementation was validated on the standard PDP URL above.

---

## What this does

- Inserts **2 new tariff cards** *before* the first existing tariff card.
- Updates based on capacity:
  - **128GB:** 100GB + Unlimited
  - **256GB:** 75GB + Unlimited
- Adds **“Online Exclusive”** roof bar styled to match design.
- Updates **Upfront / Monthly / Device + Airtime** values as per the task table.
- Updates **Price rise** values (+£2.50 Apr 2026, +£5.00 Apr 2027).
- Adds **Offer bar** and shows **Offer Details popup** with the supplied content/formatting.
- Includes **“View (2) benefits”** accordion with:
  - Roam freely in the EU, up to 25GB (with info icon)
  - Unlimited UK mins & texts
- **Choose this plan** uses a fixed configuration URL.
- Re-render safe: removes/refreshes injected cards on capacity switch and Angular updates.
- Responsive: new cards inherit O2’s existing grid classes and layout.

---

## How to run (Chrome Extension)

This task is designed to run using a “User Javascript/CSS” extension.
Link: https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en

---

## Steps

1. Install the extension: **User Javascript and CSS**
2. Open the test page:
   - https://www.o2.co.uk/shop/samsung/galaxy-s25-5g
3. Create a new rule for the domain (or exact URL match). "https://www.o2.co.uk/shop/samsung/galaxy-s25-5g"
4. Paste:
   - `experiment.js` into the **JavaScript** section
   - `experiment.css` into the **CSS** section
5. Save the rule (enable it) and refresh the page.

---

## Verification checklist

- Default load (capacity selected):
  - Two “Online Exclusive” cards appear before the existing first card.
- Switch capacity:
  - 128GB shows (100GB, Unlimited)
  - 256GB shows (75GB, Unlimited)
- Offer bar:
  - Clicking opens the offer details popup (title + content).
- Benefits:
  - “View (2) benefits” expands/collapses correctly and shows both items.
- Choose this plan:
  - Clicking routes to the provided configuration URL.
- Responsive:
  - Cards align and wrap naturally using O2’s existing grid across breakpoints.

---

## Files

- `experiment.js` – injection logic + event wiring
- `experiment.css` – scoped styling (only injected cards + injected popup content)

---

## Notes

- Implementation reuses existing DOM/components for maximum visual parity and minimal CSS.
- All styles are scoped to injected nodes (`.cro-o2-injected`) and injected popup content (`.cro-offer-body`) to avoid impacting the live page.

