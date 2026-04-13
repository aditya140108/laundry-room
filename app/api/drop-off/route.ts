import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userID } = await req.json();

        const user = await prisma.user.findUnique({
            where: { userID },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.status !== "COLLECTED") {
            return NextResponse.json(
                { error: "You haven't received your bag yet" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { userID },
            data: {
                status: "SUBMITTED",
                lastSubmitted: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}