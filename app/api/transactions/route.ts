import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { TransactionStatus, TransactionType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // Build query
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (type) {
      where.type = type;

      // For deposits, only include verified ones unless explicitly requested
      if (type === TransactionType.DEPOSIT) {
        const includeUnverified = searchParams.get('includeUnverified') === 'true';
        if (!includeUnverified) {
          where.verified = true;
        }
      }
    }
    
    if (status) {
      where.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where: where,
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