"use client";

import { useState } from "react";

const HARDCODED_USER_ID = 1020251110; // change this to whichever userID you want to test with

export default function DropOffPage() {
    const [items, setItems] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        await fetch("/api/drop-off", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: HARDCODED_USER_ID }),
        });
        setLoading(false);
        setDone(true);
    };

    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                Enter Number of Items
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    type="number"
                    placeholder="e.g. 5"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
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
                    {loading ? "Submitting..." : done ? "Submitted!" : "Submit"}
                </button>
            </div>
        </main>
    );
}