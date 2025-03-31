import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { transactionId, status } = await request.json();

        if (!transactionId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const transaction = await prisma.transaction.update({
            where: { transactionId },
            data: {
                status: status.toUpperCase(),
                verified: status.toUpperCase() === 'COMPLETED'
            }
        });

        return NextResponse.json({ message: 'Transaction status updated successfully', transaction });
    } catch (error) {
        console.error('Error verifying deposit:', error);
        return NextResponse.json({ error: 'Failed to verify deposit' }, { status: 500 });
    }
} 