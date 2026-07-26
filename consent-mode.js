(function () {
  "use strict";

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });

  function normalizeCategories(categories) {
    if (Array.isArray(categories)) {
      return categories;
    }

    if (typeof categories === "string") {
      return categories
        .split(",")
        .map(function (category) {
          return category.trim();
        })
        .filter(Boolean);
    }

    return [];
  }

  function updateGoogleConsent(acceptedCategories) {
    var accepted = normalizeCategories(acceptedCategories);
    var advertising = accepted.includes("advertisement")
      ? "granted"
      : "denied";
    var functional = accepted.includes("functional") ? "granted" : "denied";

    window.gtag("consent", "update", {
      ad_storage: advertising,
      analytics_storage: accepted.includes("analytics")
        ? "granted"
        : "denied",
      ad_user_data: advertising,
      ad_personalization: advertising,
      functionality_storage: functional,
      personalization_storage: functional,
      security_storage: "granted",
    });
  }

  document.addEventListener("cookieyes_consent_update", function (event) {
    var detail = event && event.detail ? event.detail : {};
    updateGoogleConsent(detail.accepted);
  });

  document.addEventListener("cookieyes_banner_load", function (event) {
    var detail = event && event.detail ? event.detail : {};

    if (!detail.isUserActionCompleted || !detail.categories) {
      return;
    }

    var accepted = Object.keys(detail.categories).filter(function (category) {
      var consent = detail.categories[category];
      return consent === true || consent === "yes" || consent === "granted";
    });

    updateGoogleConsent(accepted);
  });
})();
