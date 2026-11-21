import { describe, expect, it } from "vitest";
import { getNewsletterConfig } from "@/lib/newsletter";

describe("newsletter config", () => {
  it("empty username: disabled, no action", () => {
    expect(getNewsletterConfig("")).toEqual({ enabled: false, username: "", action: "" });
    expect(getNewsletterConfig("   ").enabled).toBe(false);
  });
  it("a username gives the exact Buttondown embed URL", () => {
    expect(getNewsletterConfig("dan")).toEqual({
      enabled: true,
      username: "dan",
      action: "https://buttondown.com/api/emails/embed-subscribe/dan",
    });
  });
  it("the default build has no username (no account yet)", () => {
    expect(getNewsletterConfig().enabled).toBe(false);
  });
});
