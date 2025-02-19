import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TransactionStatus, TransactionType } from '@prisma/client';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return Response.json(transactions);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}