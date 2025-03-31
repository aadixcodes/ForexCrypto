import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Try to connect to the database with a timeout
        const connectPromise = prisma.$queryRaw`SELECT 1 as health_check`;
        
        // Set a timeout for the connection attempt
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Database connection timeout after 5 seconds'));
            }, 5000);
        });
        
        // Race the connection against the timeout
        const result = await Promise.race([connectPromise, timeoutPromise]);
        
        return NextResponse.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            databaseInfo: process.env.DATABASE_URL ? 
                `${process.env.DATABASE_URL.split('@')[1].split('?')[0]}` : 'not set',
            queryResult: result
        });
    } catch (error) {
        console.error('Health check failed:', error);
        
        // Log connection details for debugging (redacted for security)
        const dbUrl = process.env.DATABASE_URL || 'not set';
        const hostInfo = dbUrl !== 'not set' ? 
            dbUrl.split('@')[1]?.split('?')[0] : 'unknown';
        
        return NextResponse.json({
            status: 'unhealthy',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            host: hostInfo || 'unknown',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 