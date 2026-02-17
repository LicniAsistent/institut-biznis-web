import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Kurs nije pronađen' }, { status: 404 });
    }

    return NextResponse.json({ course });

  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
