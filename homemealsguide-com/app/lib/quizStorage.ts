/**
 * Utility functions for managing quiz values in localStorage
 */

import { LOCAL_STORAGE_QUIZ_KEY } from "@/app/lib/constants";

export const getQuizValues = (): Record<string, string> => {
  try {
    const existingValues = localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY);
    return existingValues ? JSON.parse(existingValues) : {};
  } catch (error) {
    console.warn("Error parsing quizValues from localStorage:", error);
    return {};
  }
};

export const saveQuizValues = (key: string, value: string): void => {
  const quizValues = getQuizValues();
  quizValues[key] = value;
  localStorage.setItem(LOCAL_STORAGE_QUIZ_KEY, JSON.stringify(quizValues));
};

export const clearQuizValues = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_QUIZ_KEY);
};
