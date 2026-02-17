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
    
    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID je obavezan' }, { status: 400 });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: 'Kurs ne postoji' }, { status: 404 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Već ste upisani na ovaj kurs' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: decoded.userId,
        courseId: courseId
      }
    });

    // Give XP for enrolling
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        xpPoints: { increment: 50 } // Bonus XP for enrolling
      }
    });

    return NextResponse.json({ 
      success: true,
      enrollment,
      message: 'Uspešno upisani na kurs!'
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
