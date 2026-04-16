"use client";

import { useState } from "react";

export default function PickupPage() {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [userBags, setUserBags] = useState<
    { bagNo: string; status: string }[]
  >([]);
  const [selectedBags, setSelectedBags] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Reset UI
  const resetUI = () => {
    setUserName("");
    setUserBags([]);
    setSelectedBags([]);
    setManualInput("");
    setUserID("");
    setMessage("");
  };

  // 🔹 Fetch user
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
      console.log("API:", data);

      if (data.error) {
        setMessage(data.error);
        setUserBags([]);
        return;
      }

      // 🔥 Separate bags by status
      const readyBags = data.bags.filter(
        (b: any) => b.status === "READY"
      );

      if (readyBags.length === 0) {
        const hasCollected = data.bags.some(
          (b: any) => b.status === "COLLECTED"
        );
      
        const hasSubmitted = data.bags.some(
          (b: any) => b.status === "SUBMITTED"
        );
      
        if (hasCollected) {
          setMessage("Your bag has already been collected.");
        } else if (hasSubmitted) {
          setMessage("Your bag is not ready yet. Please come back later.");
        } else {
          setMessage("No bags found.");
        }
      
        setUserBags([]);
        setTimeout(resetUI, 1500);
        return;
      }

      setUserName(data.name || "User");
      setUserBags(readyBags);
      setSelectedBags([]);

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false); // 🔥 always runs
    }
  };

  // 🔹 Toggle bag
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
        setMessage("✅ Pickup successful");

        setTimeout(() => {
          resetUI();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
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
            className="flex-1 px-4 py-2 border rounded-md"
          />

          <button
            onClick={fetchUser}
            disabled={loading || !userID}
            className="px-6 py-2 bg-gray-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Loading..." : "Fetch User"}
          </button>
        </div>

        {/* 🔹 Message */}
        {message && (
          <div
            className={`text-center text-sm ${
              message.includes("not ready")
                ? "text-blue-600"
                : message.includes("already")
                ? "text-yellow-600"
                : message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* 🔹 User Info */}
        {userBags.length > 0 && (
          <>
            <div className="text-center font-medium">
              Hello {userName}
            </div>

            {/* 🔹 Bags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {userBags.map((bag) => (
                <button
                  key={bag.bagNo}
                  onClick={() => toggleBag(bag.bagNo)}
                  className={`px-4 py-2 rounded ${
                    selectedBags.includes(bag.bagNo)
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {bag.bagNo}
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
              className="bg-red-600 text-white py-2 rounded-md"
            >
              {loading ? "Processing..." : "Pick Up"}
            </button>
          </>
        )}

      </div>
    </main>
  );
}