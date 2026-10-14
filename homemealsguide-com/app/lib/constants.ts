// Branding and tracking config for the pages (/ and /chat).
export const WEBSITE_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME || "HomeMealsGuide",
  DOMAIN_HOST: (process.env.NEXT_PUBLIC_DOMAIN_HOST || "homemealsguide.com").toLowerCase(),
  LOGO_LIGHT: process.env.NEXT_PUBLIC_LOGO_LIGHT || "/logo-light.svg",
  LOGO_DARK: process.env.NEXT_PUBLIC_LOGO_DARK || "/logo-dark.svg",
  DEFAULT_META_TITLE:
    process.env.NEXT_PUBLIC_DEFAULT_META_TITLE || "HomeMealsGuide",
  DEFAULT_META_DESCRIPTION: "",
  DEFAULT_META_KEYWORDS: [],
};

export const SAVE_USER_VIEW_TO_REDIRECT_API_URL =
  'https://server.adstiacms.com/api/save-user-view-to-redirect';
export const ZIPCODE_API_URL = 'https://server.adstiacms.com/api/zipcode/us';

export const LOCAL_STORAGE_QUIZ_KEY = 'quizValues';
export const LOCAL_STORAGE_SESSION_ID = "session_id";
export const LOCAL_STORAGE_USER_ID = "user_id";

// CallGrid
export const CALLGRID_SCRIPT_URL = 'https://cdn.callgrid.com/callgrid.js';
export const CALLGRID_ORGANIZATION_ID = 'cmd4xbl881dqgii07o9pkkily';
export const CALLGRID_SCRIPT_SELECTOR = 'script[src*="callgrid.com"]';

// Cookie keys
export const COOKIE_EVENTN_ID = "__eventn_id";

// Script IDs
export const RINGBA_SCRIPT_ID = "ringba-script-med";
export const RINGBA_BASE_URL = "//b-js.ringba.com";

// Analytics events
export const ANALYTICS_EVENTS = {
  CTA_CLICK: "cta_click",
  CTA_BUTTON_CLICK: "ctaButtonClick",
  QUIZ: "quiz",
};
export const JITSU_EVENT = {
  PAGE_VIEW: "page_view",
  QUIZ_DATA: "quiz_data",
  LEAD_SUBMIT: "lead_submit",
};

// Quiz field names
export const QUIZ_FIELDS = {
  BIRTH_YEAR: "age",
  USER_AGE: "userAge",
  AGE: "age",
};


export const PABBLY_URL_9ZIS = 'https://connect.pabbly.com/webhook-listener/webhook/IjU3NjMwNTY0MDYzNTA0MzU1MjZmIg_3D_3D_pc/IjU3NjcwNTZmMDYzMTA0MzY1MjY1NTUzNzUxMzEi_pc'
export const COOKIE_ANONYMOUS_ID = "__eventn_id";
export const COOKIE_FBP = '_fbp';
export const COOKIE_FBC = '_fbc';
export const SESSION_STORAGE_SESSION_ID_KEY = "session_id";
export const LEADS_DATA_API_URL =
  "https://server.adstiacms.com/api/save-leads-data";
export const QUIZ_MODULE_SUBMISSION_URL =
  "https://server.adstiacms.com/v2/api/save-quiz-module-submission";

export const TRUSTED_FORM_KEYS = {
  xxTrustedFormCertUrl: "trustedFormCertUrl",
  xxTrustedFormToken: "trustedFormToken",
  xxTrustedFormPingUrl: "trustedFormPingUrl",
};

// Medicare State List
export const medStateList = {
  AR: "Arkansas",
  FL: "Florida",
  GA: "Georgia",
  IN: "Indiana",
  KY: "Kentucky",
  LA: "Louisiana",
  MO: "Missouri",
  NC: "North Carolina",
  OH: "Ohio",
  PA: "Pennsylvania",
  SC: "South Carolina",
  TN: "Tennessee",
  TX: "Texas",
  VA: "Virginia",
};

// ACA State List
export const acaStateList = {
  FL: "Florida",
  TX: "Texas",
  SC: "South Carolina",
  NC: "North Carolina",
  OH: "Ohio",
  MS: "Mississippi",
  AL: "Alabama",
  OK: "Oklahoma",
  LA: "Louisiana",
  TN: "Tennessee",
  AZ: "Arizona",
  MO: "Missouri",
};

// Handle Redirects
export const HANDLE_REDIRECTS = [
  {
    slugIncludes: '8834ncmih',
    medSuccessRedirect: '/quiz/8834ncmih/congrats-med?congrats_type=medicare',
    medDQRedirect: 'https://jvz4.com/c/3546461/419977/',
    acaSuccessRedirect: '/quiz/8834ncmih/congrats-aca?congrats_type=aca',
    acaDQRedirect: 'https://jvz4.com/c/3546461/419977/',
    feSuccessRedirect: '/quiz/8834ncmih/congrats-fe?congrats_type=fe',
    debtSuccessRedirect: 'https://track.benefits-advisor.org/3dd12dcf-4961-4933-91e8-e3c2d2017dd5',
    mvaSuccessRedirect: '/quiz/8834ncmih/congrats-mva?congrats_type=mva',
    carInsuranceSuccessRedirect: '/quiz/8834ncmih/congrats-car-insurance?congrats_type=car',
    rewardSuccessRedirect: 'https://jvz4.com/c/3546461/419977/',
    rewardDQRedirect: 'https://jvz4.com/c/3546461/419977/',
  }
]
