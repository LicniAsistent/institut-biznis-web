import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ enrolled: false, error: 'Niste prijavljeni' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: params.id
        }
      }
    });

    return NextResponse.json({ 
      enrolled: !!enrollment,
      progress: enrollment?.progress || 0,
      completedAt: enrollment?.completedAt
    });

  } catch (error) {
    console.error('Check enrollment error:', error);
    return NextResponse.json({ enrolled: false, error: 'Greška na serveru' }, { status: 500 });
  }
}
