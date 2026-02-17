import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/channels - List all channels for user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's access level
    const userAccessLevel = user.hasCourseAccess ? 'COURSE' : 
                          user.subscriptionStatus === 'active' ? 'MEMBERSHIP' : 'FREE';

    // Get channels based on user role and access
    const channels = await prisma.channel.findMany({
      where: {
        isActive: true,
        channelType: { not: 'PRIVATE' },
        OR: [
          { accessLevel: 'FREE' },
          { accessLevel: 'LOCKED' },
          user.role === 'founder' || user.role === 'vision_lead' || user.role === 'admin' 
            ? {} 
            : userAccessLevel === 'COURSE' 
              ? { accessLevel: 'COURSE' }
              : userAccessLevel === 'MEMBERSHIP'
                ? { accessLevel: { in: ['COURSE', 'MEMBERSHIP'] } }
                : {}
        ]
      },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { messages: true, participants: true }
        }
      }
    });

    // Get user's joined channels
    const participations = await prisma.channelParticipant.findMany({
      where: { userId: user.id },
      select: { channelId: true, lastReadAt: true }
    });

    const joinedChannels = new Set(participations.map(p => p.channelId));

    // Format response
    const formattedChannels = channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      type: channel.channelType,
      accessLevel: channel.accessLevel,
      isLocked: channel.accessLevel === 'LOCKED',
      isJoined: joinedChannels.has(channel.id),
      messageCount: channel._count.messages,
      participantCount: channel._count.participants,
      color: channel.color,
      icon: channel.icon,
      children: channel.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        type: child.channelType,
        accessLevel: child.accessLevel
      }))
    }));

    return NextResponse.json({ 
      channels: formattedChannels,
      userAccessLevel 
    });

  } catch (error) {
    console.error('Channels error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/channels - Create new channel (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !['founder', 'vision_lead', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Only admins can create channels' }, { status: 403 });
    }

    const { name, slug, description, channelType, accessLevel, parentId, color, icon, rules } = await request.json();

    // Check if slug exists
    const existing = await prisma.channel.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Channel with this slug already exists' }, { status: 400 });
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        slug,
        description,
        channelType: channelType || 'GENERAL',
        accessLevel: accessLevel || 'FREE',
        parentId,
        color,
        icon,
        rules,
        createdBy: user.id
      }
    });

    // Auto-join creator to channel
    await prisma.channelParticipant.create({
      data: {
        channelId: channel.id,
        userId: user.id
      }
    });

    return NextResponse.json({ channel }, { status: 201 });

  } catch (error) {
    console.error('Create channel error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
