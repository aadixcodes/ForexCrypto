import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, action, message, userData } = await request.json();

    switch (action) {
      case 'verify':
        await prisma.user.update({
          where: { id: userId },
          data: { isVerified: true }
        });
        break;
      
      case 'update':
        await prisma.user.update({
          where: { id: userId },
          data: userData
        });
        break;
      
      case 'delete':
        await prisma.user.delete({
          where: { id: userId }
        });
        break;
    }

    if (message) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (user) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: "Update from Trading Platform",
          text: message,
          html: `<div>${message}</div>`,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}