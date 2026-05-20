"use client";

import { useEffect, useState } from "react";

interface LightboxImage {
  src: string;
  alt: string;
}

export default function BlogContent({ html }: { html: string }) {
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxImage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxImage]);

  return (
    <>
      <div
        className="prose text-neutral-800 dark:text-neutral-200"
        onClick={(event) => {
          const target = event.target;
          if (!(target instanceof HTMLImageElement)) return;

          event.preventDefault();
          setLightboxImage({
            src: target.currentSrc || target.src,
            alt: target.alt || "Expanded blog image",
          });
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 p-4 sm:p-8 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded image viewer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxImage(null);
            }}
            aria-label="Close expanded image"
          >
            ✕ Close
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-h-[88vh] max-w-[96vw] object-contain rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
