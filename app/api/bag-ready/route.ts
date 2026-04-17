import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import fs from "fs";
import path from "path";
import { Status } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { bagNo } = await req.json();
    const cleanBag = bagNo.trim().toUpperCase();

    // 🔍 Find bag
    const bag = await prisma.user.findFirst({
      where: { bagNo: cleanBag },
    });

    if (!bag) {
      return Response.json({ exists: false });
    }

    // 🚨 STATUS CHECKS

    if (bag.status === Status.READY) {
      return Response.json({
        exists: true,
        emailSent: false,
        message: "Bag is already marked as ready.",
      });
    }

    if (bag.status === Status.COLLECTED) {
      return Response.json({
        exists: true,
        emailSent: false,
        message: "Bag has already been collected.",
      });
    }

    // ✅ ONLY SUBMITTED → READY
    await prisma.user.update({
      where: { id: bag.id },
      data: {
        status: Status.READY,
        lastReady: new Date(),
      },
    });

    // 📧 Send email
    if (!bag.email) {
      return Response.json({
        exists: true,
        emailSent: false,
      });
    }

    const filePath = path.join(process.cwd(), "templates/collection.html");
    let html = fs.readFileSync(filePath, "utf-8");

    html = html
      .replace(/{{bagNo}}/g, cleanBag)
      .replace(/{{name}}/g, bag.name || "User");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: bag.email,
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