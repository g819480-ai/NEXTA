"use client";

import { useState } from "react";

export default function Import1688Page() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function importProduct() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/1688/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">
          Import Product from 1688
        </h1>

        <p className="mt-2 text-gray-400">
          Paste a 1688 product link and import its product information.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste 1688 product URL"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <button
            onClick={importProduct}
            disabled={loading || !url}
            className="mt-4 w-full rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Importing..." : "Import Product"}
          </button>

          {error && (
            <div className="mt-4 rounded-xl bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {result && (
            <pre className="mt-6 max-h-[500px] overflow-auto rounded-xl bg-black p-4 text-xs text-green-400">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}
