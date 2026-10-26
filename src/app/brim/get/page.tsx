import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PassThrough } from "../PassThrough";
import { BUILDS } from "../downloads";

export const metadata: Metadata = {
  title: "Brim: starting your download",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ build?: string }> };

// Pass-through page. It exists so that a download click is counted as a
// pageview of /brim/get before the browser fetches the installer.
export default async function BrimGetPage({ searchParams }: Props) {
  const { build: id } = await searchParams;
  const build = BUILDS.find((b) => b.id === id);
  if (!build) redirect("/brim");
  return (
    <PassThrough
      url={build.url}
      event="download_click"
      heading={`Downloading Brim for ${build.name} Macs.`}
      fallback="download it here"
    />
  );
}
