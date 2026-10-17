import type { Metadata } from "next";
import { GoToCheckout } from "../buy/GoToCheckout";
import { TRIAL_CHECKOUT_URL } from "../checkout";

export const metadata: Metadata = {
  title: "Brim: starting your trial",
  robots: { index: false, follow: false },
};

// Pass-through page. It exists so that a trial click is counted as a pageview
// of /brim/trial before the visitor lands on Lemon Squeezy.
export default function BrimTrialPage() {
  return (
    <GoToCheckout
      url={TRIAL_CHECKOUT_URL}
      event="trial_click"
      heading="Starting your free trial."
    />
  );
}
