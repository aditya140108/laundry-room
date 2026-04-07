import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { bagNo } = await req.json();

    const bag = await prisma.user.findFirst({
      where: { bagNo },
    });

    if (!bag) {
      return Response.json({ exists: false });
    }

    // Send email
    const filePath = path.join(process.cwd(), "templates/collection.html");
    let html = fs.readFileSync(filePath, "utf-8");

    html = html
    .replace(/{{bagNo}}/g, bagNo)
    .replace(/{{name}}/g, bag.name || "User");


    if (!bag) {
      return Response.json({ exists: false });
    }
    
    if (!bag.email) {
      return Response.json({
        exists: true,
        emailSent: false,
      });
    }
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: bag.email,
      subject: "Laundry Update",  
      html: html,
    });
    
    return Response.json({
      exists: true,
      emailSent: true,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}