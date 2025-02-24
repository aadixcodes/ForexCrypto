import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TransactionStatus, TransactionType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      transactions
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch transactions' 
    }, { status: 500 });
  }
}