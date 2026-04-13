import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import fs from "fs";
import path from "path";
import { Status } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { bagNo } = await req.json();
    const cleanBag = bagNo.trim().toUpperCase();

    // 1️⃣ Find which user owns this bag
    const users = await prisma.user.findMany();

    const owner = users.find((u) => {
      const bags = (u.bagNo || "")
        .split(",")
        .map((b) => b.trim().toUpperCase());

      return bags.includes(cleanBag);
    });

    if (!owner) {
      return Response.json({ exists: false });
    }

    // 2️⃣ Update status → READY
    await prisma.user.update({
      where: { userID: owner.userID },
      data: {
        status: Status.READY,
        lastReady: new Date(),
      },
    });

    // 3️⃣ Send email (if email exists)
    if (!owner.email) {
      return Response.json({
        exists: true,
        emailSent: false,
      });
    }

    const filePath = path.join(process.cwd(), "templates/collection.html");
    let html = fs.readFileSync(filePath, "utf-8");

    html = html
      .replace(/{{bagNo}}/g, cleanBag)
      .replace(/{{name}}/g, owner.name || "User");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: owner.email,
      subject: "Laundry Update",
      html,
    });

    return Response.json({
      exists: true,
      emailSent: true,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}