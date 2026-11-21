import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Subscribe } from "@/components/site/Subscribe";

afterEach(cleanup);

describe("Subscribe", () => {
  it("coming soon: input and button disabled, RSS fallback link", () => {
    const { container } = render(<Subscribe note="n" username="" />);
    expect(screen.getByLabelText("Email address")).toHaveProperty("disabled", true);
    expect(screen.getByRole("button", { name: "Get the next post" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("link", { name: "RSS feed" }).getAttribute("href")).toBe("/feed.xml");
    expect(container.querySelector("form")!.getAttribute("action")).toBeNull();
  });

  it("ready: posts to Buttondown in a new tab with the required fields", () => {
    const { container } = render(<Subscribe note="One email per post." username="example" />);
    const form = container.querySelector("form")!;
    expect(form.getAttribute("action")).toBe("https://buttondown.com/api/emails/embed-subscribe/example");
    expect(form.getAttribute("method")).toBe("post");
    expect(form.getAttribute("target")).toBe("_blank");
    const email = form.querySelector('input[name="email"]')!;
    expect(email.getAttribute("type")).toBe("email");
    expect(email.hasAttribute("required")).toBe(true);
    const tag = form.querySelector('input[type="hidden"][name="tag"]')!;
    expect(tag.getAttribute("value")).toBe("tech-site");
    expect(screen.getByText("One email per post.")).toBeTruthy();
  });
});
