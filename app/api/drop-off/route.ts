import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userID = parseInt(searchParams.get("userID") || "");

    if (isNaN(userID)) {
        return NextResponse.json({ error: "Invalid userID" }, { status: 400 });
    }

    const collectedBags = await prisma.user.findMany({
        where: { userID, status: "COLLECTED" },
        select: { userID: true, bagNo: true, name: true },
    });

    const submittedBags = await prisma.user.findMany({
        where: { userID, status: "SUBMITTED" },
        select: { bagNo: true, clothesCount: true, lastSubmitted: true },
    });

    return NextResponse.json({ bags: collectedBags, submittedBags });
}

export async function POST(req: Request) {
    try {
        const { userID, bagNo, clothesCount } = await req.json();

        if (!userID || !bagNo) {
            return NextResponse.json({ error: "Please select a bag" }, { status: 400 });
        }

        const bag = await prisma.user.findFirst({
            where: { userID, bagNo },
        });

        if (!bag) {
            return NextResponse.json({ error: "Bag not found" }, { status: 404 });
        }

        if (bag.status !== "COLLECTED") {
            return NextResponse.json(
                { error: "This bag has already been dropped off" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { bagNo },
            data: {
                status: "SUBMITTED",
                lastSubmitted: new Date(),
                clothesCount: clothesCount || 0,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const bagNo = searchParams.get("bagNo");

        if (!bagNo) {
            return NextResponse.json({ error: "Bag number required" }, { status: 400 });
        }

        await prisma.user.update({
            where: { bagNo },
            data: {
                status: "COLLECTED",
                lastSubmitted: null,
                clothesCount: 0,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}