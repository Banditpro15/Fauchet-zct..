import React, { useState } from "react";

export default function FaucetPage() {
  const FAUCET_ENDPOINT =
    process.env.NEXT_PUBLIC_FAUCET_ENDPOINT || "https://faucet.zenchain.io/request";

  const [address, setAddress] = useState("");
  const [tweetUrl, setTweetUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  async function requestFaucet(e) {
    e.preventDefault();
    if (!address) {
      alert("Masukkan alamat wallet terlebih dahulu.");
      return;
    }

    setLoading(true);
    setStatus("Mengirim permintaan ke faucet...");
    setLastResponse(null);

    try {
      const payload = { address, tweet_url: tweetUrl || undefined };

      const res = await fetch(FAUCET_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      setLastResponse({ status: res.status, ok: res.ok, body: data });

      if (res.ok) {
        setStatus("✅ Berhasil! Token faucet sedang dikirim.");
      } else {
        setStatus(`❌ Faucet error (status ${res.status}).`);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Terjadi kesalahan saat menghubungi faucet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0fdf4", padding: "2rem" }}>
      <div style={{ maxWidth: "500px", width: "100%", background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "1rem" }}>ZTC Faucet</h1>

        <form onSubmit={requestFaucet} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            placeholder="0x... Alamat Wallet"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
          />

          <input
            placeholder="Link X Post (opsional)"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "6px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#ccc" : "#16a34a",
              color: "#fff",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Mengirim..." : "Receive ZTC"}
          </button>
        </form>

        <div style={{ marginTop: "1rem", fontSize: "14px" }}>
          <b>Status:</b> {status || "Belum ada aktivitas"}
        </div>

        {lastResponse && (
          <pre
            style={{
              marginTop: "0.5rem",
              fontSize: "12px",
              background: "#f3f4f6",
              padding: "0.75rem",
              borderRadius: "6px",
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
