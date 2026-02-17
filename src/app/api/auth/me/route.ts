import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Niste prijavljeni' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Korisnik nije pronađen' },
        { status: 404 }
      );
    }

    // Return user without password
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        rankLevel: user.rankLevel,
        xpPoints: user.xpPoints,
        role: user.role,
        bio: user.bio,
        location: user.location,
        industry: user.industry,
        yearsExperience: user.yearsExperience,
        verified: user.verified,
        verificationStatus: user.verificationStatus,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Sesija je istekla' },
      { status: 401 }
    );
  }
}
