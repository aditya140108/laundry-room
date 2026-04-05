import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

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
      text: `Your bag ${bagNo} is ready for collection.`,
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