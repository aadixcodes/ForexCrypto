import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get userId from headers for authorization
    const userId = request.headers.get('X-User-Id');
    const userRole = request.headers.get('X-User-Role');
    
    // Check if user is admin
    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { transactionId, verified } = body;
    
    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Only allow verification of deposit transactions
    if (existingTransaction.type !== 'DEPOSIT') {
      return NextResponse.json(
        { success: false, message: 'Only deposit transactions can be verified' },
        { status: 400 }
      );
    }

    // Update transaction verification status
    const transaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        verified,
        status: verified ? 'COMPLETED' : 'FAILED',
        description: verified 
          ? 'Deposit verified by admin' 
          : 'Deposit rejected by admin',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: verified ? 'Deposit verified successfully' : 'Deposit rejected',
      transaction,
    });
  } catch (error) {
    console.error('Error verifying deposit:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process verification request' },
      { status: 500 }
    );
  }
} 