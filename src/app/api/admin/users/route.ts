import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

// Check if user can access admin
function canAccessAdmin(user: any): boolean {
  return user?.role === 'founder' || 
         user?.role === 'vision_lead' || 
         user?.role === 'admin';
}

export async function GET(request: NextRequest) {
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

    if (!currentUser || !canAccessAdmin(currentUser)) {
      return NextResponse.json({ error: 'Nemate pristup admin panelu' }, { status: 403 });
    }

    // Get all users (with role)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        nickname: true,
        fullName: true,
        bio: true,
        industry: true,
        rankLevel: true,
        xpPoints: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ 
      users,
      currentUserRole: currentUser.role 
    });

  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
