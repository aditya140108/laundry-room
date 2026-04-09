"use client";

import { useState } from "react";

export default function PickupPage() {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [userBags, setUserBags] = useState<string[]>([]);
  const [selectedBags, setSelectedBags] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch user (simulate QR scan)
  const fetchUser = async () => {
    if (!userID) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/pick-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: Number(userID),
          action: "fetch",
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        setUserBags([]);
        return;
      }
      // Status check
      if (data.status === "COLLECTED") {
        setMessage('Your bag has already been collected.');
        setUserBags([]);
        setTimeout(() => {
          setUserName("");
          setUserBags([]);
          setSelectedBags([]);
          setManualInput("");
          setUserID('');
          setMessage("")
          setLoading(false)
        }, 1500);
        return;
      }
      if (data.status === "SUBMITTED") {
        setMessage("Your bag is not ready yet. Please come back later.");
        setUserBags([]);

        setTimeout(() => {
          setUserName("");
          setUserBags([]);
          setSelectedBags([]);
          setManualInput("");
          setUserID('');
          setMessage("")
          setLoading(false);
        }, 1500);
        return;
      }

      setUserName(data.name || "User");
      setUserBags(data.bags);
      setSelectedBags([]);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }

    setLoading(false);

  };


  const toggleBag = (bag: string) => {
    setSelectedBags((prev) =>
      prev.includes(bag)
        ? prev.filter((b) => b !== bag)
        : [...prev, bag]
    );
  };

  // 🔹 Handle pickup
  const handlePickup = async () => {
    setLoading(true);
    setMessage("");

    const manualBags = manualInput
      .split(",")
      .map((b) => b.trim().toUpperCase())
      .filter(Boolean);

    try {
      const res = await fetch("/api/pick-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: Number(userID),
          action: "pickup",
          selectedBags,
          manualBags,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage("Pickup successful");
        setTimeout(() => {
          setUserName("");
          setUserBags([]);
          setSelectedBags([]);
          setManualInput("");
          setUserID('');
          setMessage("")
        }, 2500);
      }

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-md flex flex-col gap-4">

        {/* 🔹 User ID Input */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-grey-500"
          />

          <button
            onClick={fetchUser}
            disabled={loading}
            className="px-6 py-2 bg-gray-500 hover:bg-red-700 text-white font-medium rounded-md shadow-sm cursor-pointer transition-colors disabled:opacity-50"
          >
            Fetch User
          </button>
        </div>

        {/* 🔹 Message */}
        {message && (
          <div
            className={`text-center text-sm ${message.includes("not ready")
                ? "text-blue-600"
                : message.includes("already")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
          >
            {message}
          </div>
        )}

        {/* 🔹 User Info */}
        {userBags && userBags.length > 0 && (
          <>
            <div className="text-center font-medium">
              Hello {userName}
            </div>

            {/* 🔹 Bags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {userBags.map((bag) => (
                <button
                  key={bag}
                  onClick={() => toggleBag(bag)}
                  className={`px-4 py-2 rounded cursor-pointer ${selectedBags.includes(bag)
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  {bag}
                </button>
              ))}
            </div>

            {/* 🔹 Manual Input */}
            <input
              type="text"
              placeholder="Enter other bag numbers (comma separated)"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />

            {/* 🔹 Pickup Button */}
            <button
              onClick={handlePickup}
              disabled={loading}
              className="bg-red-600 text-white py-2 rounded-md cursor-pointer"
            >
              {loading ? "Processing..." : "Pick Up"}
            </button>
          </>
        )}

      </div>
    </main>
  );
}