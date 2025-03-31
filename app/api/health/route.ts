import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Try to connect to the database with a timeout
        const connectPromise = prisma.$queryRaw`SELECT NOW() as current_time`;
        
        // Set a timeout for the connection attempt
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Database connection timeout after 10 seconds'));
            }, 10000);
        });
        
        // Race the connection against the timeout
        const result = await Promise.race([connectPromise, timeoutPromise]);
        
        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            poolerInfo: process.env.DATABASE_URL ? 
                process.env.DATABASE_URL.split('@')[1].split('/')[0] : 'not set',
            result
        });
    } catch (error) {
        console.error('Health check failed:', error);
        
        // Provide more detailed error diagnostics
        let errorDetails = 'Unknown error';
        if (error instanceof Error) {
            errorDetails = error.message;
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
        }
        
        return NextResponse.json({
            status: 'unhealthy',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            error: errorDetails
        }, { status: 500 });
    }
} 