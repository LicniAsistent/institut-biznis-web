import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ROLES, type UserRole } from '@/lib/rbac';

// GET /api/admin/users/[id] - Get single user by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });
    }

    // Check if user is founder or admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!adminUser || (adminUser.role !== 'founder' && adminUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Nemate admin privilegije' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        location: true,
        industry: true,
        yearsExperience: true,
        rankLevel: true,
        xpPoints: true,
        role: true,
        verified: true,
        subscriptionStatus: true,
        promotionBalance: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Korisnik ne postoji' }, { status: 404 });
    }

    // Get role visual config if exists
    const roleConfig = ROLES[user.role as UserRole]?.visual;

    return NextResponse.json({ 
      user,
      roleConfig
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Greška pri dohvatanju korisnika' }, { status: 500 });
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 });
    }

    // Check if user is founder
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, id: true }
    });

    if (!adminUser || adminUser.role !== 'founder') {
      return NextResponse.json({ error: 'Samo founder može menjati korisnike' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      nickname, 
      fullName, 
      bio, 
      avatarUrl, 
      rankLevel, 
      xpPoints, 
      role,
      verified,
      subscriptionStatus,
      promotionBalance
    } = body;

    // Prevent changing founder role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (targetUser?.role === 'founder') {
      return NextResponse.json({ error: 'Nije moguće menjati founder nalog' }, { status: 403 });
    }

    // Validate role if provided
    if (role && !Object.keys(ROLES).includes(role)) {
      return NextResponse.json({ error: 'Nevažeća uloga' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(nickname && { nickname }),
        ...(fullName && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(rankLevel !== undefined && { rankLevel }),
        ...(xpPoints !== undefined && { xpPoints }),
        ...(role && { role }),
        ...(verified !== undefined && { verified }),
        ...(subscriptionStatus !== undefined && { subscriptionStatus }),
        ...(promotionBalance !== undefined && { promotionBalance }),
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        fullName: true,
        role: true,
        rankLevel: true,
        xpPoints: true,
        verified: true,
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Korisnik uspešno ažuriran',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Greška pri ažuriranju korisnika' }, { status: 500 });
  }
}
