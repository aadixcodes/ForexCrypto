import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// For verifying users
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {

    const { userId } = params;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });

    // // Send verification email
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM,
    //   to: user.email,
    //   subject: "Account Verified - Trading Platform",
    //   text: "Your account has been verified. You can now start trading.",
    //   html: "<div>Your account has been verified. You can now start trading.</div>",
    // });

    return NextResponse.json({ success: true });
}

// For updating user details
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const userData = await request.json();

  // Parse the dob field as a Date object
  if (userData.dob) {
    userData.dob = new Date(userData.dob);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: userData,
  });

  return NextResponse.json({ success: true, user });
}

// For deleting users
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    await prisma.user.delete({
      where: { id: userId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
} 