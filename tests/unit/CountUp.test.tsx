import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { CountUp } from "@/components/motion/CountUp";
import { installMatchMedia } from "./motion-media";

const REDUCE = "(prefers-reduced-motion: reduce)";
const ALLOW = "(prefers-reduced-motion: no-preference)";

// Both queries a browser answers for the one system setting.
function motionSetting(reduce: boolean) {
  const media = installMatchMedia({ [REDUCE]: reduce, [ALLOW]: !reduce });
  return {
    set(next: boolean) {
      media.set(REDUCE, next);
      media.set(ALLOW, !next);
    },
  };
}

// A fake IntersectionObserver we can trigger by hand.
let observers: { cb: IntersectionObserverCallback; disconnected: boolean }[] = [];
class FakeIO {
  rec: { cb: IntersectionObserverCallback; disconnected: boolean };
  constructor(cb: IntersectionObserverCallback) {
    this.rec = { cb, disconnected: false };
    observers.push(this.rec);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    this.rec.disconnected = true;
  }
}
function scrollIntoView() {
  for (const o of observers) {
    if (!o.disconnected) o.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
  }
}

let frames: FrameRequestCallback[] = [];
beforeEach(() => {
  observers = [];
  frames = [];
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIO;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    frames.push(cb);
    return frames.length;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const text = (c: HTMLElement) => c.querySelector("span")!.textContent;

describe("CountUp", () => {
  it("counts from 0 when motion is allowed", () => {
    motionSetting(false);
    const { container } = render(<CountUp value={1200} />);
    act(() => scrollIntoView());
    expect(text(container)).toBe("0");
    expect(frames.length).toBe(1);
  });

  it("shows the final number at once when reduce motion is on at load", () => {
    motionSetting(true);
    const { container } = render(<CountUp value={1200} />);
    act(() => scrollIntoView());
    expect(text(container)).toBe("1,200");
    expect(frames.length).toBe(0);
  });

  // Regression: reduce motion turned on after load still let an off-screen
  // counter animate when the reader scrolled to it.
  it("never animates when reduce motion is turned on after load", () => {
    const media = motionSetting(false);
    const { container } = render(<CountUp value={1200} />);
    act(() => media.set(true));
    act(() => scrollIntoView());
    expect(text(container)).toBe("1,200");
    expect(frames.length).toBe(0);
  });

  it("stops a count in flight when reduce motion is turned on", () => {
    const media = motionSetting(false);
    const { container } = render(<CountUp value={1200} />);
    act(() => scrollIntoView());
    expect(text(container)).toBe("0");
    act(() => media.set(true));
    expect(text(container)).toBe("1,200");
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("checks the setting again at the moment the number is reached", () => {
    // Even if a change event is missed, the check at intersection wins.
    const state = { reduce: false };
    window.matchMedia = ((q: string) => ({
      media: q,
      get matches() {
        return q === REDUCE ? state.reduce : q === ALLOW ? !state.reduce : false;
      },
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    const { container } = render(<CountUp value={1200} />);
    state.reduce = true;
    act(() => scrollIntoView());
    expect(text(container)).toBe("1,200");
    expect(frames.length).toBe(0);
  });
});
