import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bagNo } = await req.json();

    const bag = await prisma.user.findFirst({
      where: {
        bagNo: bagNo.trim().toUpperCase(),
      },
    });

    return Response.json({
      exists: !!bag,
    });
  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
