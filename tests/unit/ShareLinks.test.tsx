import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ShareLinks, copyText } from "@/components/post/ShareLinks";

// Regression: "Copy link" said "Copied" even when the clipboard refused the
// write or did not exist, so a reader pasted whatever was there before.
const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
function setClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", { value, configurable: true });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  if (original) Object.defineProperty(navigator, "clipboard", original);
  else delete (navigator as { clipboard?: unknown }).clipboard;
});

async function clickCopy() {
  render(<ShareLinks url="https://tech.dandiggas.com/posts/x" title="X" />);
  const button = screen.getByRole("button");
  await act(async () => {
    fireEvent.click(button);
  });
  return button;
}

describe("ShareLinks copy button", () => {
  it("says Copied only after the write succeeds, then resets", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    const button = await clickCopy();
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(button.textContent).toBe("Copied");
    await act(async () => {
      vi.advanceTimersByTime(1300);
    });
    expect(button.textContent).toBe("Copy link");
  });

  it("says Copy failed when permission is denied", async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new DOMException("denied", "NotAllowedError")) });
    const button = await clickCopy();
    expect(button.textContent).toBe("Copy failed");
    expect(button.getAttribute("data-state")).toBe("failed");
  });

  it("says Copy failed when there is no clipboard", async () => {
    setClipboard(undefined);
    const button = await clickCopy();
    expect(button.textContent).toBe("Copy failed");
  });

  it("does not say Copied while the write is still pending", async () => {
    let resolve!: () => void;
    setClipboard({ writeText: () => new Promise<void>((r) => (resolve = r)) });
    const button = await clickCopy();
    expect(button.textContent).toBe("Copy link");
    await act(async () => resolve());
    expect(button.textContent).toBe("Copied");
  });
});

describe("copyText", () => {
  it("is false without a clipboard and true after a good write", async () => {
    setClipboard(undefined);
    expect(await copyText("a")).toBe(false);
    setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    expect(await copyText("a")).toBe(true);
  });
});
