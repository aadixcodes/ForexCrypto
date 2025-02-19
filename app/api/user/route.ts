import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                phone: true,
                gender: true,
                dob: true,
                address: true,
                aadharNo: true,
                bankName: true,
                accountHolder: true,
                accountNumber: true,
                ifscCode: true,
                pan: true,
                nomineeName: true,
                nomineeRelation: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        
        // Update user data
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                phone: data.phone,
                gender: data.gender,
                dob: new Date(data.dob),
                address: data.address,
                bankName: data.bankName,
                accountHolder: data.accountHolder,
                nomineeName: data.nomineeName,
                nomineeRelation: data.nomineeRelation,
            },
            select: {
                name: true,
                email: true,
                phone: true,
                gender: true,
                dob: true,
                address: true,
                aadharNo: true,
                bankName: true,
                accountHolder: true,
                accountNumber: true,
                ifscCode: true,
                pan: true,
                nomineeName: true,
                nomineeRelation: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 