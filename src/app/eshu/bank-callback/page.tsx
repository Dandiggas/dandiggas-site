"use client";

// Open Banking redirect bounce for Eshu (the local artist-manager app).
// Banks require an https redirect URL; Eshu lives on the artist's machine.
// This page forwards the auth code straight to the local app and keeps
// nothing — the code is useless without the private key on that machine.
import { useEffect, useState } from "react";

export default function EshuBankCallback() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const target = "http://127.0.0.1:8188/" + window.location.search;
    const timer = setTimeout(() => setFailed(true), 4000);
    window.location.replace(target);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ fontFamily: "system-ui", textAlign: "center", padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "1.3rem" }}>Finishing your bank connection…</h1>
      <p style={{ color: "#666", maxWidth: "34rem", margin: "0.75rem auto" }}>
        Handing you back to Eshu on this computer.
        {failed &&
          " If nothing happened, make sure Eshu is open and you started the bank link from its Finance page, then try the link again."}
      </p>
    </main>
  );
}
