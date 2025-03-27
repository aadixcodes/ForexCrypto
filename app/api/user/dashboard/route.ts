import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const userId = request.headers.get('X-User-Id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch user details
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
            }
        });

        // Fetch account statistics
        const [
            totalDeposits,
            totalWithdrawals,
            recentTransactions,
            openPositions,
            approvedLoan
        ] = await Promise.all([
            prisma.transaction.aggregate({
                where: {
                    userId,
                    type: 'DEPOSIT',
                    status: 'COMPLETED',
                    verified: true
                },
                _sum: { amount: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    userId,
                    type: 'WITHDRAW',
                    status: 'COMPLETED'
                },
                _sum: { amount: true }
            }),
            prisma.transaction.findMany({
                where: { 
                    userId,
                    OR: [
                        { 
                            type: 'WITHDRAW',
                            status: 'COMPLETED'
                        },
                        { 
                            type: 'DEPOSIT',
                            status: 'COMPLETED',
                            verified: true
                        }
                    ]
                },
                orderBy: { timestamp: 'desc' },
                take: 5,
                select: {
                    id: true,
                    type: true,
                    amount: true,
                    timestamp: true,
                    status: true,
                    verified: true
                }
            }),
            prisma.orderHistory.findMany({
                where: { 
                    userId,
                    status: 'OPEN'
                },
                orderBy: { tradeDate: 'desc' },
                select: {
                    id: true,
                    symbol: true,
                    type: true,
                    profitLoss: true,
                    tradeDate: true,
                    quantity: true,
                    buyPrice: true
                }
            }),
            prisma.loanRequest.findFirst({
                where: {
                    userId,
                    status: 'APPROVED'
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                select: {
                    amount: true,
                    duration: true,
                    updatedAt: true
                }
            })
        ]);

        // Get approved loan amount
        const approvedLoanAmount = approvedLoan ? approvedLoan.amount : 0;

        // Calculate account balance and other metrics
        const baseAccountBalance = (totalDeposits._sum.amount || 0) - (totalWithdrawals._sum.amount || 0);
        const accountBalance = baseAccountBalance + approvedLoanAmount;
        const profitLoss = openPositions.reduce((sum, position) => sum + (position.profitLoss || 0), 0);

        return NextResponse.json({
            user,
            dashboardData: {
                accountBalance,
                baseAccountBalance,
                totalDeposits: totalDeposits._sum.amount || 0,
                totalWithdrawals: totalWithdrawals._sum.amount || 0,
                profitLoss,
                approvedLoanAmount,
                approvedLoanDetails: approvedLoan,
                recentTransactions,
                openPositions
            }
        });
    } catch (error) {
        console.error('Dashboard fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
} 