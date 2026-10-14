import type { Metadata, Viewport } from "next";
import "./chat.css";
import ChatPage from "./ChatPage";

export const metadata: Metadata = {
  description:
    "Chat with us for 30 seconds to see if you qualify for free home-delivered meals: 3 a day, 7 days a week, for eligible Medicaid members in NYC and New Jersey.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "light",
  themeColor: "#FFFFFF",
};

export default function Page() {
  return <ChatPage />;
}
