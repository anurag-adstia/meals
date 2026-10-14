import type { Metadata, Viewport } from "next";
import "./home.css";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  description:
    "Free meals delivered to your door, 3 a day, 7 days a week, for eligible Medicaid members in NYC and New Jersey. Check if you qualify in 30 seconds.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#E6EFFC",
};

export default function Page() {
  return <HomePage />;
}
