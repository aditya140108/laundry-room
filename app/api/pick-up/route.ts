import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

const TEST_IDS = [1020251110, 1020251111, 1020251112];

export async function POST(req: Request) {
  try {
    const { userID, action, selectedBags = [], manualBags = [] } =
      await req.json();

    if (!TEST_IDS.includes(userID)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // =========================
    // FETCH
    // =========================
    if (action === "fetch") {
      const user = await prisma.user.findUnique({
        where: { userID },
      });
    
      if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }
    
      const bags = (user.bagNo || "")
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);
    
      return Response.json({
        name: user.name,
        status: user.status,
        bags,
      });
    }

    // =========================
    // PICKUP
    // =========================
    if (action === "pickup") {
      const allBags = [
        ...selectedBags,
        ...manualBags.map((b: string) => b.trim()),
      ];

      const users = await prisma.user.findMany();

      for (const bag of allBags) {
        const owner = users.find((u) => {
          const bags = (u.bagNo || "")
            .split(",")
            .map((b) => b.trim());

          return bags.includes(bag);
        });

        if (!owner) continue;

        await prisma.user.update({
          where: { userID: owner.userID },
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
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}