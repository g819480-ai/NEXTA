“use client”;

import { useState } from “react”;

export default function Import1688Page() {
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);

async function runSync() {
setLoading(true);
setResult(null);

try {
  const response = await fetch("/api/1688/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  setResult({
    status: response.status,
    ...data,
  });
} catch (error) {
  setResult({
    success: false,
    error:
      error instanceof Error
        ? error.message
        : "Unable to connect to sync API",
  });
} finally {
  setLoading(false);
}

}

return (
<main
style={{
minHeight: “100vh”,
padding: “40px 20px”,
background: “#0b0b0b”,
color: “#fff”,
}}
>
<div
style={{
maxWidth: “900px”,
margin: “0 auto”,
}}
>
<h1 style={{ fontSize: “32px”, marginBottom: “10px” }}>
NESTA 1688 Sync
    <p
      style={{
        color: "#aaa",
        marginBottom: "30px",
      }}
    >
      Automatically search 1688 and import products into NESTA.
    </p>
    <button
      onClick={runSync}
      disabled={loading}
      style={{
        padding: "14px 24px",
        border: "none",
        borderRadius: "8px",
        background: loading ? "#555" : "#e11d48",
        color: "#fff",
        fontSize: "16px",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Syncing 1688..." : "Start 1688 Sync"}
    </button>
    {result && (
      <pre
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#151515",
          borderRadius: "10px",
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: "#ddd",
        }}
      >
        {JSON.stringify(result, null, 2)}
      </pre>
    )}
  </div>
</main>

);
}
