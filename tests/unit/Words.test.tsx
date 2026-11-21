import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Words } from "@/components/motion/Words";

afterEach(cleanup);

describe("Words", () => {
  it("keeps the sentence intact for copy and screen readers", () => {
    const text = "I run AI coding agents all day and write down what actually happened.";
    const { container } = render(<Words text={text} />);
    const h1 = container.querySelector("h1")!;
    expect(h1.textContent).toBe(text);
    expect(h1.querySelectorAll("span.w")).toHaveLength(text.split(" ").length);
    expect(h1.className).toContain("words");
  });
});
