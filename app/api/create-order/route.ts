import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
}); 

export async function POST(req: Request) {
  try {
    const { amount, description = "Deposit Transaction", userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      notes: {
        userId,
        description
      }
    });

    // Create a pending transaction with more details
    await prisma.transaction.create({
      data: {
        userId,
        type: "DEPOSIT",
        transactionId: order.id,
        status: "PENDING",
        amount: amount / 100,
        description,
        metadata: {
          razorpayOrder: JSON.parse(JSON.stringify(order)),
          userAgent: req.headers.get("user-agent"),
          ipAddress: req.headers.get("x-forwarded-for") || "unknown"
        },
        currency: "INR"
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}