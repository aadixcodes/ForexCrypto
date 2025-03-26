import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Check if user is admin
    const cookieStore = cookies();
    const userRole = cookieStore.get('userRole')?.value;
    
    if (!userRole || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // First check if order exists and is in PENDING_SELL status
    const existingOrder = await prisma.orderHistory.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (existingOrder.status.toString() !== "PENDING_SELL") {
      return NextResponse.json(
        { error: "Only pending sell orders can be approved" },
        { status: 400 }
      );
    }

    // Calculate profit/loss
    const profitLoss = 
      (existingOrder.sellPrice as number - existingOrder.buyPrice) * existingOrder.quantity;

    // Update the order status to CLOSED and add the profit/loss
    const updatedOrder = await prisma.orderHistory.update({
      where: { id: orderId },
      data: {
        status: "CLOSED" as any,
        profitLoss: profitLoss,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error approving sell request:", error);
    return NextResponse.json(
      { error: "Failed to approve sell request" },
      { status: 500 }
    );
  }
}