import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const { xp, lessonId, courseId } = await request.json();

    if (!xp) {
      return NextResponse.json({ error: 'XP je obavezan' }, { status: 400 });
    }

    // Update user XP
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        xpPoints: { increment: xp }
      }
    });

    // If lessonId and courseId provided, mark lesson as completed
    if (lessonId && courseId) {
      // You could create a LessonProgress model here
      // For now just track completion
    }

    return NextResponse.json({ 
      success: true,
      totalXP: user.xpPoints,
      message: `+${xp} XP dodato!`
    });

  } catch (error) {
    console.error('Update XP error:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
