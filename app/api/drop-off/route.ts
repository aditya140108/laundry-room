import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userID } = await req.json();

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