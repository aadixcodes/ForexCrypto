import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get active UPI payment information
export async function GET() {
  try {
    // Find active UPI payment info
    const paymentInfo = await prisma.paymentInfo.findFirst({
      where: { 
        type: 'UPI',
        isActive: true
      },
    });

    // If no active UPI payment info is found, create a default one
    if (!paymentInfo) {
      const defaultPaymentInfo = await prisma.paymentInfo.create({
        data: {
          type: 'UPI',
          upiId: 'developer.aditya09@oksbi',
          merchantName: 'Astex',
          isActive: true,
        }
      });
      
      return NextResponse.json({
        success: true,
        paymentInfo: defaultPaymentInfo
      });
    }

    return NextResponse.json({
      success: true,
      paymentInfo
    });
  } catch (error) {
    console.error('Error fetching payment info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment information' },
      { status: 500 }
    );
  }
}