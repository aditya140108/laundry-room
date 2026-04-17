import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userID = Number(body.userID);
    const action = body.action;
    const selectedBags = body.selectedBags || [];
    const manualBags = body.manualBags || [];

    if (!userID) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // =========================
    // 🔹 FETCH USER BAGS
    // =========================
    if (action === "fetch") {
      const bags = await prisma.user.findMany({
        where: { userID },
      });

      if (!bags.length) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      return Response.json({
        name: bags[0].name,
        bags: bags.map((b) => ({
          bagNo: b.bagNo,
          status: b.status,
        })),
      });
    }

    // =========================
    // 🔹 PICKUP
    // =========================
    if (action === "pickup") {
      const allBags = [
        ...selectedBags,
        ...manualBags.map((b: string) => b.trim().toUpperCase()),
      ];

      if (allBags.length === 0) {
        return Response.json({ error: "No bags selected" }, { status: 400 });
      }

      for (const bag of allBags) {
        const existing = await prisma.user.findUnique({
          where: { bagNo: bag },
        });

        if (!existing) continue;

        await prisma.user.update({
          where: { bagNo: bag },
          data: {
            status: Status.COLLECTED,
            lastCollectedBy: userID,
            lastCollected: new Date(),
          },
        });
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}