import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { LINKS } from "@/lib/links";
import { SocialLinks } from "@/components/SocialLinks";
import { Footer } from "@/components/site/Footer";

afterEach(cleanup);

describe("links", () => {
  it("X points at @Dandiggastech", () => {
    expect(LINKS.x).toBe("https://x.com/Dandiggastech");
    expect(LINKS.xHandle).toBe("@Dandiggastech");
  });
  it("SocialLinks renders it", () => {
    const { container } = render(<SocialLinks />);
    expect(container.querySelector(`a[href="${LINKS.x}"]`)).not.toBeNull();
    expect(container.querySelector('a[href="https://x.com/dandiggas"]')).toBeNull();
  });
  it("the footer renders it, plus RSS, LinkedIn and Now", () => {
    const { container } = render(<Footer />);
    for (const href of [LINKS.x, LINKS.rss, LINKS.linkedin, LINKS.now, LINKS.subscribe]) {
      expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull();
    }
  });
});
