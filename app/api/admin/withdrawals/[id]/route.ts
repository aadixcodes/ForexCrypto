import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, remarks } = await request.json();
    
    // TODO: Add admin authentication check here
    
    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        status: status as TransactionStatus,
        metadata: {
          update: {
            remarks: remarks || undefined,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Failed to update withdrawal status:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update withdrawal status"
      },
      { status: 500 }
    );
  }
}