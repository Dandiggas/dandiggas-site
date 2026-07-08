"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import { photos, type Photo } from "@/lib/music";

export function PhotoGallery() {
  const [active, setActive] = useState<Photo | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  function open(photo: Photo, trigger: HTMLElement) {
    lastFocused.current = trigger;
    setActive(photo);
  }

  useEffect(() => {
    if (!active) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        return;
      }
      // The close button is the only focusable control in the dialog; keep
      // focus trapped on it rather than letting Tab reach the covered grid.
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      lastFocused.current?.focus();
      lastFocused.current = null;
    };
  }, [active]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo) => (
          <button
            key={photo.src}
            type="button"
            onClick={(e) => open(photo, e.currentTarget)}
            aria-label={`Expand photo: ${photo.alt}`}
            className="group mb-4 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-music-hairline break-inside-avoid"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo viewer"
          onClick={() => setActive(null)}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive(null);
            }}
            aria-label="Close expanded photo"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 sm:right-6 sm:top-6"
          >
            <X weight="bold" />
          </button>
          <Image
            src={active.src}
            alt={active.alt}
            width={active.w}
            height={active.h}
            sizes="96vw"
            className="max-h-[88vh] w-auto max-w-[96vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
