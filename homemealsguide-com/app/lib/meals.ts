// Call button config and tracking shared by the quiz page (/) and the chat page (/chat).

import { MouseEvent, useEffect, useState } from "react";
import {
  pushLocalDataToDataLayer,
  sendDataToJitsuEvent,
  trackPhoneButtonClick,
} from "./analytics";
import {
  ANALYTICS_EVENTS,
  COOKIE_EVENTN_ID,
  LOCAL_STORAGE_SESSION_ID,
  LOCAL_STORAGE_USER_ID,
} from "./constants";
import { getCookie } from "./getCookie";
import { saveQuizValues } from "./quizStorage";

export const PHONE = process.env.NEXT_PUBLIC_PHONE || ""; // e.g. '+18885551234' → buttons dial directly
export const PHONE_LABEL = process.env.NEXT_PUBLIC_PHONE_LABEL || ""; // e.g. '(888) 555-1234' → shown under the button
export const CALL_URL =
  process.env.NEXT_PUBLIC_CALL_URL || "https://lander91rtu.senior-advisors.org/landers/6eqi"; // used when PHONE is empty
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""; // Meta Pixel ID; empty = no pixel

/** Where the call buttons go: the phone number, or the call URL with the Voluum click id. */
export const useCallHref = (): string => {
  const [href, setHref] = useState("#");

  useEffect(() => {
    const clickId = new URLSearchParams(window.location.search).get("vl_click_id");
    setHref(
      PHONE
        ? "tel:" + PHONE
        : CALL_URL + (clickId ? "?vl_click_id=" + encodeURIComponent(clickId) : "")
    );
  }, []);

  return href;
};

export const trackFb = (event: string): void => {
  (window as any).fbq?.("track", event);
};

/** One answered question: saved to quizValues, sent to Jitsu and the dataLayer. */
export const trackAnswer = (name: string, value: string, step: number): void => {
  saveQuizValues(name, value);
  sendDataToJitsuEvent(
    JSON.stringify({
      questionKey: name,
      questionType: "options",
      answer: value,
      currentStep: String(step),
      previousStep: step > 1 ? String(step - 1) : "-",
      nextStep: String(step + 1),
    })
  );
  pushLocalDataToDataLayer();
};

/** Click on a call button. */
export const trackCallClick = (e: MouseEvent<HTMLAnchorElement>): void => {
  const ctaText = e.currentTarget.textContent?.trim() || "";
  const href = e.currentTarget.href.trim() || "";

  window?.jitsu?.track(ANALYTICS_EVENTS.CTA_CLICK, {
    cta_text: ctaText,
    session_id: sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID),
    userId: localStorage.getItem(LOCAL_STORAGE_USER_ID) || "",
  });

  window?.dataLayer?.push({
    event: ANALYTICS_EVENTS.CTA_BUTTON_CLICK,
    data: {
      cta_text: ctaText,
      session_id: sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID) || "",
      user_id: localStorage.getItem(LOCAL_STORAGE_USER_ID) || "",
      anonymous_id: getCookie(COOKIE_EVENTN_ID) || "",
    },
  });

  trackFb("Contact");

  if (PHONE) {
    trackPhoneButtonClick(PHONE);
    return;
  }

  // Leaving the page: give the events a moment to go out first
  e.preventDefault();
  setTimeout(() => {
    window.location.href = href;
  }, 300);
};
