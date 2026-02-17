import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname, fullName } = await request.json();

    // Validate input
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: 'Email, lozinka i nadimak su obavezni' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Lozinka mora imati najmanje 6 karaktera' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Korisnik sa ovim email-om već postoji' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Nadimak je već zauzet' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nickname,
        fullName: fullName || null,
      }
    });

    // Generate JWT - SA ROLOM
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
        role: user.role, // Dodaj rolu u response
      },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Došlo je do greške prilikom registracije' },
      { status: 500 }
    );
  }
}
