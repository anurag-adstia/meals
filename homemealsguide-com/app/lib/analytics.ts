/**
 * Utility functions for analytics tracking (Jitsu and DataLayer)
 */

import {
  LOCAL_STORAGE_USER_ID,
  LOCAL_STORAGE_SESSION_ID,
  LOCAL_STORAGE_QUIZ_KEY,
  COOKIE_EVENTN_ID,
  JITSU_EVENT,
  ANALYTICS_EVENTS,
} from "@/app/lib/constants";
import { getCookie } from "./getCookie";
import generateUUID from "./generateUUID";

interface JitsuEventData {
  questionKey: string;
  questionType: string;
  answer: boolean;
  currentStep: string;
  previousStep: string;
  nextStep: string;
}

/**
 * Get or create user ID
 */
export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem(LOCAL_STORAGE_USER_ID);
  if (!userId) {
    userId = `user_id_${generateUUID()}`;
    localStorage.setItem(LOCAL_STORAGE_USER_ID, userId);
  }
  return userId;
};

/**
 * Get anonymous ID from cookie
 */
export const getAnonymousId = (): string => {
  return getCookie(COOKIE_EVENTN_ID) || "";
};

/**
 * Send quiz data to Jitsu
 */
export const sendDataToJitsuEvent = (data: string): void => {
  if (typeof window === "undefined") return;

  try {
    const EVENT_DATA: JitsuEventData = JSON.parse(data);
    let nodeName = EVENT_DATA.questionKey;
    nodeName = nodeName?.split("_")?.slice(1)?.join("_") || nodeName;

    const answerValue = EVENT_DATA.answer || false;
    const userId = getOrCreateUserId();
    const sessionId = sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID) || "";

    (window as any)?.jitsu?.track(JITSU_EVENT.QUIZ_DATA, {
      user_id: userId,
      session_id: sessionId,
      question_key: EVENT_DATA.questionKey,
      question_type: EVENT_DATA.questionType,
      answer_value: answerValue,
      current_step: EVENT_DATA.currentStep,
      previous_step: EVENT_DATA.previousStep,
      next_step: EVENT_DATA.nextStep,
    });
  } catch (err) {
    console.error("Failed to send data to Jitsu:", err);
  }
};

/**
 * Push local quiz data to dataLayer
 */
export const pushLocalDataToDataLayer = (): void => {
  if (typeof window === "undefined") return;

  const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID) || "";
  const sessionId = sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID) || "";
  const anonymousId = getAnonymousId();
  const storedData = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY) || "{}"
  );

  let data: Record<string, unknown> = {};
  Object.entries(storedData).forEach(([key, value]) => {
    data[key] = value;
  });

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: ANALYTICS_EVENTS.QUIZ,
    data: { ...data, user_id: userId, session_id: sessionId, anonymous_id: anonymousId },
  });
};

/**
 * Send lead submit event to Jitsu
 */
export const sendJitsuLeadSubmitEvent = (jsonData: Record<string, unknown>): void => {
  if (typeof window === "undefined") return;

  try {
    (window as any)?.jitsu?.track("lead_submit", jsonData);
  } catch (err) {
    console.error("Failed to send lead submit to Jitsu:", err);
  }
};

/**
 * Push data to Ringba tags
 */
export const pushDataToRingbaTags = (retries = 2): void => {
  if (typeof window === "undefined") return;
  if (retries === 0) return;

  try {
    const quizData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY) || "{}");
    const searchParams = new URLSearchParams(window.location.search);
    const anonymousId = getAnonymousId();

    const ringbaData: Record<string, unknown> = {
      ...quizData,
      ...Object.fromEntries(searchParams.entries()),
      user_id: localStorage.getItem(LOCAL_STORAGE_USER_ID) || "",
      session_id: sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID) || "",
      anonymous_id: anonymousId || "",
    };

    // Remove screenResolution if present
    const { screenResolution, ...filteredRingbaData } = ringbaData;

    const entries = Object.entries(filteredRingbaData);
    (window as any)._rgba_tags = (window as any)?._rgba_tags || [];

    entries.forEach((item) => {
      (window as any)?._rgba_tags?.push({ [item[0]]: item[1] });
    });

    setTimeout(() => {
      pushDataToRingbaTags(retries - 1);
    }, 1500);
  } catch (err) {
    console.error("Error pushing data to Ringba tags:", err);
  }
};

/**
 * Track phone number button click
 */
export const trackPhoneButtonClick = async (phone: string): Promise<void> => {
  if (typeof window === "undefined") return;

  const quizValues = (() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY) || "{}");
    } catch {
      return {};
    }
  })();

  try {
    (window as any)?.jitsu?.track("phone_number_click", {
      ...quizValues,
      phone,
      session_id: sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID) || "",
      userId: localStorage.getItem(LOCAL_STORAGE_USER_ID) || "",
    });

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any)?.dataLayer?.push({ data: null });

    (window as any)?.dataLayer?.push({
      event: "phoneNumberClick",
      data: {
        ...quizValues,
        phone,
        session_id: sessionStorage.getItem(LOCAL_STORAGE_SESSION_ID) || "",
        user_id: localStorage.getItem(LOCAL_STORAGE_USER_ID) || "",
        anonymous_id: getCookie(COOKIE_EVENTN_ID) || "",
      },
    });
  } catch (err) {
    console.error("Failed to track phone button click:", err);
  }
};
