import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get userId from searchParams
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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
      select: {
        id: true,
        type: true,
        amount: true,
        status: true,
        description: true,
        timestamp: true,
      }
    });

    // Transform the data to match the frontend Transaction type
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type.toLowerCase() as "deposit" | "withdrawal",
      date: transaction.timestamp.toISOString().split('T')[0],
      description: transaction.description || '',
      amount: transaction.amount,
      status: transaction.status.toLowerCase()
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}