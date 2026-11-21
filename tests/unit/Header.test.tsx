import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { installMatchMedia } from "./motion-media";

vi.mock("next/navigation", () => ({ usePathname: () => "/tech" }));
vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "light", setTheme: () => {} }) }));

import { DESKTOP_QUERY, Header } from "@/components/site/Header";

afterEach(cleanup);

// Regression: open the mobile menu, rotate past 720px, and the menu stayed
// open beside the desktop nav with its close button hidden.
describe("Header mobile menu", () => {
  it("closes when the window grows to desktop width", () => {
    const media = installMatchMedia({ [DESKTOP_QUERY]: false });
    render(<Header />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeTruthy();

    act(() => media.set(DESKTOP_QUERY, true));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();

    // Back to phone width: still shut, the open button shows.
    act(() => media.set(DESKTOP_QUERY, false));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
    expect(screen.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("removes its listener on unmount", () => {
    const media = installMatchMedia({ [DESKTOP_QUERY]: false });
    const { unmount } = render(<Header />);
    expect(media.listenerCount(DESKTOP_QUERY)).toBe(1);
    unmount();
    expect(media.listenerCount(DESKTOP_QUERY)).toBe(0);
  });
});
