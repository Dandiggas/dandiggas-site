// Brim is sold through Lemon Squeezy (store "Brim", live product 1451161, recreated 18 Oct 2026).
// Every Buy button on the site goes through /brim/buy first, so each click
// shows up in Vercel Web Analytics as a pageview of that path. The Hobby plan
// has no custom events, so a counted page is the only click count we get.
export const CHECKOUT_URL =
  "https://brim.lemonsqueezy.com/checkout/buy/8bde5fcc-b99a-4f0b-b9a7-8eddec5a6324";

export function buyPath(from: string) {
  return `/brim/buy?from=${encodeURIComponent(from)}`;
}

// The free 7 day trial is a £0 Lemon Squeezy product (live product 1447910)
// that emails a key with a 7 day life, good on one Mac.
export const TRIAL_CHECKOUT_URL =
  "https://brim.lemonsqueezy.com/checkout/buy/884a537d-63c4-462b-bb63-c53211422860";

export function trialPath(from: string) {
  return `/brim/trial?from=${encodeURIComponent(from)}`;
}
