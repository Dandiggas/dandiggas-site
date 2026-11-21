// Buttondown newsletter config. The username is a placeholder until the
// account exists; with it empty, the sign-up form shows "coming soon".
// It is public by design (it is in the form URL) and NEXT_PUBLIC_, so it is
// inlined at build time: changing it needs a rebuild.
export const BUTTONDOWN_USERNAME = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME ?? "";

export type NewsletterConfig = { enabled: boolean; username: string; action: string };

export function getNewsletterConfig(username: string = BUTTONDOWN_USERNAME): NewsletterConfig {
  const u = username.trim();
  return {
    enabled: u.length > 0,
    username: u,
    action: u ? `https://buttondown.com/api/emails/embed-subscribe/${u}` : "",
  };
}
