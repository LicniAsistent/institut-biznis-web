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
    
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    // Only founder, vision_lead, admin can update users
    const canManage = ['founder', 'vision_lead', 'admin'].includes(currentUser?.role || '');
    
    if (!currentUser || !canManage) {
      return NextResponse.json({ error: 'Nemate dozvolu' }, { status: 403 });
    }

    const { userId, role, rankLevel, xpPoints, verified } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID je obavezan' }, { status: 400 });
    }

    // Only founder can change roles
    if (role && currentUser.role !== 'founder') {
      return NextResponse.json({ error: 'Samo founder može menjati činove' }, { status: 403 });
    }

    // Prevent changing own role (founder protection)
    if (userId === currentUser.id && role) {
      return NextResponse.json({ error: 'Ne možete sebi menjati čin' }, { status: 400 });
    }

    // Update user
    const updateData: any = {};
    if (role) updateData.role = role;
    if (rankLevel !== undefined) updateData.rankLevel = rankLevel;
    if (xpPoints !== undefined) updateData.xpPoints = xpPoints;
    if (verified !== undefined) updateData.verified = verified;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        nickname: true,
        rankLevel: true,
        xpPoints: true,
        role: true,
        verified: true,
      }
    });

    return NextResponse.json({ 
      success: true,
      user: updatedUser,
      message: `Korisnik ${updatedUser.nickname} je ažuriran`
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
