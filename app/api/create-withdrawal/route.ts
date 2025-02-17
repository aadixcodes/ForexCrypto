import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionStatus, TransactionType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { amount, userId } = await request.json();
    console.log(amount,userId)

    if (!amount || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.PENDING,
        amount,
        transactionId: `WD${Date.now()}`,
        description: "Withdrawal request",
        currency: "INR",
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Withdrawal creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process withdrawal" },
      { status: 500 }
    );
  }
} 