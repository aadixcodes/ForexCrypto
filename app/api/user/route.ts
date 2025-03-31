import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const userId = request.headers.get('X-User-Id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isVerified: true,
                role: true,
                status: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
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
        
        // Transform the incoming data to match database structure
        const updateData = {
            name: `${data.firstName} ${data.lastName}`,
            phone: data.mobile,
            gender: data.gender,
            dob: new Date(data.dob),
            address: data.address,
            bankName: data.bankName,
            accountHolder: data.accountHolder,
            accountNumber: data.accountNumber,
            ifscCode: data.ifsc,
            nomineeName: data.nomineeName,
            nomineeRelation: data.nomineeRelation,
        };

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
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

        // Transform the response to match frontend structure
        const transformedUser = {
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ').slice(1).join(' '),
            email: user.email,
            username: user.email.split('@')[0],
            gender: user.gender,
            mobile: user.phone,
            aadhar: user.aadharNo,
            dob: user.dob.toISOString(),
            address: user.address,
            bankName: user.bankName,
            accountHolder: user.accountHolder,
            accountNumber: user.accountNumber,
            ifsc: user.ifscCode,
            pan: user.pan,
            nomineeName: user.nomineeName,
            nomineeRelation: user.nomineeRelation,
            nomineeDob: user.dob.toISOString(),
        };

        return NextResponse.json(transformedUser);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 