"use client";

import { useState } from "react";

export default function Home() {
  const [bagNo, setBagNo] = useState("");
  const [status, setStatus] = useState<null | "found" | "not-found">(null);
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetUI = () => {
    setBagNo("");
    setStatus(null);
    setEmailSent(null);
    setMessage("");
  };

  const checkBag = async () => {
    if (!bagNo) return;

    setLoading(true);
    setStatus(null);
    setEmailSent(null);
    setMessage("");

    try {
      const res = await fetch("/api/check-bag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bagNo: bagNo.trim().toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!data.exists) {
        setStatus("not-found");
        return;
      }

      if (data.message) {
        setStatus(null); // ❌ don't show success
        setMessage(data.message);
        setEmailSent(null);
        setTimeout(resetUI, 2500)
        return;
      }

      setStatus("found");
      setEmailSent(data.emailSent ?? null);

      // reset after success
      setTimeout(resetUI, 2000);

    } catch (err) {
      console.error(err);
      setStatus("not-found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-white min-h-screen">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* 🔹 Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={bagNo}
            onChange={(e) => setBagNo(e.target.value)}
            placeholder="Enter bag number"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            onClick={checkBag}
            disabled={loading || !bagNo}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </div>

        {/* 🔹 Status */}
        {status && (
          <div
            className={`text-center px-4 py-2 rounded-md font-medium ${status === "found"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {status === "found"
              ? "✅ Bag Logged as Ready"
              : "❌ Bag Not Found"}
          </div>
        )}

        {/* 🔹 Message (edge cases) */}
        {message && (
          <div className="text-center text-sm text-yellow-700">
            {message}
          </div>
        )}

        {/* 🔹 Email */}
        {status === "found" && emailSent !== null && !message && (
          <div
            className={`text-center px-4 py-2 rounded-md font-medium ${emailSent
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {emailSent
              ? "📧 Email sent to user"
              : "⚠️ No email on file for this user"}
          </div>
        )}

      </div>
    </main>
  );
}