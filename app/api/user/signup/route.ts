import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password,firstName,lastName, phone, aadharNo, pan, gender, dob, nomineeName, nomineeRelation, nomineeDob, bankName, accountNumber, accountHolder, ifscCode, address } = await request.json();

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone: phone },
                    { aadharNo: aadharNo },
                    { pan: pan },
                    { accountNumber: accountNumber }
                ]
            }
        });

        if (existingUser) {
            throw new Error('User with these details already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = firstName + " " + lastName
        // Create a new user in the database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                aadharNo,
                pan,
                gender,
                dob: new Date(dob),
                nomineeName,
                nomineeRelation,
                nomineeDob: new Date(nomineeDob),
                bankName,
                accountNumber,
                accountHolder,
                ifscCode,
                address,
            },
        });

        return NextResponse.json({ message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
        }
    }
} 