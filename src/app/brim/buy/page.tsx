import type { Metadata } from "next";
import { GoToCheckout } from "./GoToCheckout";
import { CHECKOUT_URL } from "../checkout";

export const metadata: Metadata = {
  title: "Brim: taking you to checkout",
  robots: { index: false, follow: false },
};

// Pass-through page. It exists so that a Buy click is counted as a pageview
// of /brim/buy before the visitor lands on Lemon Squeezy.
export default function BrimBuyPage() {
  return (
    <GoToCheckout url={CHECKOUT_URL} event="buy_click" heading="Taking you to checkout." />
  );
}
