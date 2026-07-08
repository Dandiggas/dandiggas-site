import { SocialLinks } from "@/components/SocialLinks";

export function ContactCTA() {
  return (
    <div className="rounded-2xl border border-music-hairline bg-music-surface px-6 py-14 text-center sm:py-16">
      <h2 className="text-3xl font-bold tracking-tight text-music-fg sm:text-4xl">
        Bookings and sessions
      </h2>
      <p className="mx-auto mt-4 max-w-md text-music-muted">
        For live dates and session work, reach me through any of these.
      </p>
      <div className="mt-8 flex justify-center text-music-fg">
        <SocialLinks />
      </div>
    </div>
  );
}
