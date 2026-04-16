"use client";

import { useState, useEffect } from "react";

const HARDCODED_USER_ID = 1020253333;

interface Bag {
    userID: number;
    bagNo: string;
    name: string;
}

interface SubmittedBag {
    bagNo: string;
    clothesCount: number | null;
    lastSubmitted: string | null;
}

export default function DropOffPage() {
    const [bags, setBags] = useState<Bag[]>([]);
    const [submittedBags, setSubmittedBags] = useState<SubmittedBag[]>([]);
    const [selectedBagNo, setSelectedBagNo] = useState<string>("");
    const [clothesCount, setClothesCount] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBags();
    }, []);

    async function fetchBags() {
        try {
            const res = await fetch(`/api/drop-off?userID=${HARDCODED_USER_ID}`);
            const data = await res.json();
            setBags(data.bags || []);
            setSubmittedBags(data.submittedBags || []);
            if (data.bags?.length === 1) {
                setSelectedBagNo(data.bags[0].bagNo);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFetchLoading(false);
        }
    }

    const handleSubmit = async () => {
        if (!selectedBagNo) {
            setError("Please select a bag");
            return;
        }

        const count = parseInt(clothesCount, 10);
        if (isNaN(count) || count <= 0) {
            setError("Number of clothes cannot be less than 1");
            return;
        }

        setError("");
        setLoading(true);
        const res = await fetch("/api/drop-off", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: HARDCODED_USER_ID, bagNo: selectedBagNo, clothesCount: count }),
        });
        setLoading(false);

        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Something went wrong");
            return;
        }

        fetchBags();
        setSelectedBagNo(bags.length === 2 ? bags.find((b) => b.bagNo !== selectedBagNo)?.bagNo || "" : "");
        setClothesCount("");
    };

    const handleCancel = async (bagNo: string) => {
        setLoading(true);
        await fetch(`/api/drop-off?bagNo=${bagNo}`, { method: "DELETE" });
        setLoading(false);
        fetchBags();
    };

    const formatTime = (dateStr: string | null) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    if (fetchLoading) {
        return <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</main>;
    }

    const allSubmitted = bags.length === 0 && submittedBags.length > 0;

    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "2rem",
                gap: "1rem",
            }}
        >
            {bags.length > 0 && (
                <>
                    <p style={{ fontSize: "1.25rem" }}>
                        Number of Clothes
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                            type="number"
                            placeholder="e.g. 5"
                            value={clothesCount}
                            onChange={(e) => {
                                setClothesCount(e.target.value);
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
                    {bags.length > 1 && (
                        <>
                            <p style={{ fontSize: "1.25rem" }}>
                                Select Bag
                            </p>
                            <select
                                value={selectedBagNo}
                                onChange={(e) => {
                                    setSelectedBagNo(e.target.value);
                                    setError("");
                                }}
                                style={{
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    width: "200px",
                                }}
                            >
                                <option value="">-- Select a bag --</option>
                                {bags.map((bag) => (
                                    <option key={bag.bagNo} value={bag.bagNo}>
                                        {bag.bagNo} - {bag.name}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </>
            )}
            {bags.length === 0 && submittedBags.length === 0 && (
                <p style={{ fontSize: "1.25rem" }}>No bags available to drop off</p>
            )}
            {error && (
                <p style={{ color: "red", fontSize: "0.875rem" }}>
                    {error}
                </p>
            )}
            {submittedBags.length > 0 && (
                <div style={{ marginTop: "2rem", width: "100%", maxWidth: "400px" }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", textAlign: "center" }}>Submitted Requests</h3>
                    {submittedBags.map((bag) => (
                        <div
                            key={bag.bagNo}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "1rem",
                                marginBottom: "0.5rem",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <p><strong>Bag:</strong> {bag.bagNo}</p>
                            <p><strong>Items:</strong> {bag.clothesCount}</p>
                            <p><strong>Submitted:</strong> {formatTime(bag.lastSubmitted)}</p>
                            <button
                                onClick={() => handleCancel(bag.bagNo)}
                                disabled={loading}
                                style={{
                                    marginTop: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "0.875rem",
                                    backgroundColor: "#dc2626",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                            >
                                Cancel Request
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
