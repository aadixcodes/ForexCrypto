import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionStatus, TransactionType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Get userId from searchParams
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            bankName: true,
            accountNumber: true,
            accountHolder: true,
            ifscCode: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      transactions: transactions.map(t => ({
        ...t,
        type: t.type as TransactionType,
        status: t.status as TransactionStatus
      }))
    });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}