import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await db.query('SELECT NOW()');
        return NextResponse.json({
            success: true,
            message: 'Connexion à PostgreSQL réussie !',
            time: result.rows[0].now
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}