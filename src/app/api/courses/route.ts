import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const courses = await prisma.course.findMany({
      where: published === 'true' ? { published: true } : {},
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        price: true,
        thumbnail: true,
        published: true,
        createdAt: true,
        _count: {
          select: { enrollments: true }
        }
      }
    });

    return NextResponse.json({ courses });

  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
