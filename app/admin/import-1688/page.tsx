“use client”;

import { useState } from “react”;

export default function Import1688Page() {
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(””);

async function runSync() {
setLoading(true);
setResult(””);

try {
  const response = await fetch("/api/1688/sync", {
    method: "POST",
  });
  const text = await response.text();
  setResult(
    "HTTP " + response.status + "\n\n" + text
  );
} catch (error) {
  setResult(
    error instanceof Error
      ? error.message
      : "Request failed"
  );
}
setLoading(false);

}

return (
NESTA 1688 Sync

  <button
    onClick={runSync}
    disabled={loading}
  >
    {loading ? "Syncing..." : "Start 1688 Sync"}
  </button>
  <pre>{result}</pre>
</div>

);
}
