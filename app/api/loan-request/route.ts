import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, duration } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { loanRequest: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a loan request
    if (user.loanRequest) {
      return NextResponse.json(
        { error: 'User already has an active loan request' },
        { status: 400 }
      );
    }

    // Create new loan request
    const loanRequest = await prisma.loanRequest.create({
      data: {
        userId: user.id,
        amount: parseFloat(amount),
        duration: parseInt(duration),
      },
    });

    return NextResponse.json(loanRequest);
  } catch (error) {
    console.error('Loan request error:', error);
    return NextResponse.json(
      { error: 'Failed to create loan request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { loanRequest: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.loanRequest);
  } catch (error) {
    console.error('Fetch loan request error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loan request' },
      { status: 500 }
    );
  }
} 