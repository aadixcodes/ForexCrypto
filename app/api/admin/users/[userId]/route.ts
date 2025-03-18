import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

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
  try {
    const { userId } = params;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// For updating user details
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
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
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// For deleting users
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Delete related records first to handle foreign key constraints
    // Note: This assumes your Prisma schema has the proper relationships defined
    await prisma.$transaction([
      // Delete related transactions
      prisma.transaction.deleteMany({
        where: { userId: userId }
      }),
      
      // Delete related orders
      prisma.orderHistory.deleteMany({
        where: { userId: userId }
      }),
      
      // Delete related loan requests
      prisma.loanRequest.deleteMany({
        where: { userId: userId }
      }),
      
      // Finally delete the user
      prisma.user.delete({
        where: { id: userId }
      })
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to delete user. There might be related records preventing deletion." 
    }, { status: 500 });
  }
}

export async function GET(
  request: Request, 
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        transactions: true,
        orders: true,
        loanRequest: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}