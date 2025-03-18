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
            openPositions
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
            })
        ]);

        // Calculate account balance and other metrics
        const accountBalance = (totalDeposits._sum.amount || 0) - (totalWithdrawals._sum.amount || 0);
        const profitLoss = openPositions.reduce((sum, position) => sum + (position.profitLoss || 0), 0);

        return NextResponse.json({
            user,
            dashboardData: {
                accountBalance,
                totalDeposits: totalDeposits._sum.amount || 0,
                totalWithdrawals: totalWithdrawals._sum.amount || 0,
                profitLoss,
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