import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

const MESSAGE_LIMIT = 50;

// GET /api/channels/[id]/messages - Get messages in channel
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const channelId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor');
    const threadOnly = searchParams.get('thread') === 'true';

    // Check channel access
    const channel = await prisma.channel.findUnique({
      where: { id: channelId }
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Check if user has access to this channel
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    const userAccessLevel = user?.hasCourseAccess ? 'COURSE' : 
                          user?.subscriptionStatus === 'active' ? 'MEMBERSHIP' : 'FREE';

    const hasAccess = 
      channel.accessLevel === 'FREE' ||
      channel.accessLevel === 'LOCKED' ||
      (channel.accessLevel === 'COURSE' && userAccessLevel === 'COURSE') ||
      (channel.accessLevel === 'MEMBERSHIP' && ['COURSE', 'MEMBERSHIP'].includes(userAccessLevel)) ||
      ['founder', 'vision_lead', 'admin'].includes(user?.role || '');

    if (!hasAccess) {
      return NextResponse.json({ error: 'No access to this channel' }, { status: 403 });
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        channelId,
        parentId: threadOnly ? { not: null } : null,
        isDeleted: false
      },
      take: threadOnly ? 100 : MESSAGE_LIMIT,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            role: true,
            rankLevel: true,
            xpPoints: true
          }
        },
        reactions: {
          include: {
            user: {
              select: { id: true, nickname: true }
            }
          }
        },
        _count: {
          select: { replies: true }
        }
      }
    });

    // Get reply counts for each message
    const messagesWithReplies = await Promise.all(
      messages.map(async (msg) => {
        const replyCount = await prisma.message.count({
          where: { parentId: msg.id, isDeleted: false }
        });
        
        return { ...msg, replyCount };
      })
    );

    // Get pinned messages
    const pinnedMessages = await prisma.pinnedMessage.findMany({
      where: { channelId },
      include: {
        message: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Mark channel as read
    await prisma.channelParticipant.upsert({
      where: {
        channelId_userId: {
          channelId,
          userId: decoded.userId
        }
      },
      create: {
        channelId,
        userId: decoded.userId,
        lastReadAt: new Date()
      },
      update: {
        lastReadAt: new Date()
      }
    });

    return NextResponse.json({
      messages: messagesWithReplies,
      pinned: pinnedMessages.map(p => p.message),
      hasMore: messages.length === MESSAGE_LIMIT
    });

  } catch (error) {
    console.error('Messages error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/channels/[id]/messages - Send message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { content, parentId } = await request.json();
    const channelId = params.id;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Check channel access and participation
    const participation = await prisma.channelParticipant.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId: decoded.userId
        }
      }
    });

    if (!participation?.isMuted === false) {
      return NextResponse.json({ error: 'You cannot send messages in this channel' }, { status: 403 });
    }

    // Check if parent message exists (for replies)
    if (parentId) {
      const parentMessage = await prisma.message.findUnique({
        where: { id: parentId }
      });
      if (!parentMessage || parentMessage.channelId !== channelId) {
        return NextResponse.json({ error: 'Parent message not found' }, { status: 404 });
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        channelId,
        authorId: decoded.userId,
        parentId
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            role: true,
            rankLevel: true,
            xpPoints: true
          }
        }
      }
    });

    // Update reply count on parent
    if (parentId) {
      await prisma.message.update({
        where: { id: parentId },
        data: { replyCount: { increment: 1 } }
      });
    }

    // Update user's XP
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { xpPoints: { increment: 5 } }
    });

    return NextResponse.json({ message }, { status: 201 });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
