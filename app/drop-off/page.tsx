"use client";

import { useState } from "react";

export default function DropOffPage() {
    const [items, setItems] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        const itemCount = parseInt(items, 10);

        if (isNaN(itemCount) || itemCount <= 0) {
            setError("Number of clothes cannot be less than 1");
            return;
        }

        setError("");
        setLoading(true);
        const res = await fetch("/api/drop-off", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: 1020251111 }),
        });
        setLoading(false);

        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
            return;
        }
    };

    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "1rem",
            }}
        >
            <p style={{ fontSize: "1.25rem" }}>
                Enter Number of Items
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    type="number"
                    placeholder="e.g. 5"
                    value={items}
                    onChange={(e) => {
                        setItems(e.target.value);
                        setError("");
                    }}
                    style={{
                        padding: "0.5rem 1rem",
                        fontSize: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                    }}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: "0.5rem 1.25rem",
                        fontSize: "1rem",
                        backgroundColor: loading ? "#f87171" : "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
            {error && (
                <p style={{ color: "red", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                    {error}
                </p>
            )}
        </main>
    );
}
