import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    await prisma.orderHistory.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const data = await request.json();

    // Remove id from data to avoid unique constraint error
    const { id, ...updateData } = data;

    // Update the order
    const updatedOrder = await prisma.orderHistory.update({
      where: { id: orderId },
      data: {
        symbol: updateData.symbol,
        quantity: updateData.quantity,
        buyPrice: updateData.buyPrice,
        sellPrice: updateData.sellPrice,
        tradeAmount: updateData.tradeAmount,
        type: updateData.type,
        status: updateData.status,
        tradeDate: new Date(updateData.tradeDate),
        profitLoss: updateData.profitLoss,
        userId: updateData.userId,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}