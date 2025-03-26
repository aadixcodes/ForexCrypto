import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { TradeStatus } from "@/app/types/orders";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the order and verify it's in PENDING_SELL status
    const order = await prisma.orderHistory.findFirst({
      where: {
        id: orderId,
        status: TradeStatus.PENDING_SELL as any,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or not in pending sell status" },
        { status: 404 }
      );
    }

    // Calculate profit/loss
    const profitLoss = order.type === "LONG" 
      ? (order.sellPrice! - order.buyPrice) * order.quantity
      : (order.buyPrice - order.sellPrice!) * order.quantity;

    // Update the order to CLOSED status with profit/loss
    const updatedOrder = await prisma.orderHistory.update({
      where: {
        id: orderId,
      },
      data: {
        status: TradeStatus.CLOSED as any,
        profitLoss,
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