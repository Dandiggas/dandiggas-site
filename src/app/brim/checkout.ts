// Brim is sold through Lemon Squeezy (store "Brim", live product 1444195).
// Every Buy button on the site goes through /brim/buy first, so each click
// shows up in Vercel Web Analytics as a pageview of that path. The Hobby plan
// has no custom events, so a counted page is the only click count we get.
export const CHECKOUT_URL =
  "https://brim.lemonsqueezy.com/checkout/buy/24e2a8d2-b617-4aa1-b6bb-413f439a774b";

export function buyPath(from: string) {
  return `/brim/buy?from=${encodeURIComponent(from)}`;
}

// The free 7 day trial is a £0 Lemon Squeezy product that emails a key.
// TEST-MODE checkout until the live twin exists (Linear MUS-258); one line to swap.
export const TRIAL_CHECKOUT_URL =
  "https://brim.lemonsqueezy.com/checkout/buy/059aa60d-32df-4040-8242-e9944a6ad503";

export function trialPath(from: string) {
  return `/brim/trial?from=${encodeURIComponent(from)}`;
}
