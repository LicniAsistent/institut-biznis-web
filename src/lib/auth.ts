// ==========================================
// AUTHENTICATION SYSTEM
// Founder Account: petar.jurkovic666@gmail.com
// ==========================================

export interface User {
  id: string;
  email: string;
  nickname: string;
  password?: string; // In production, this would be hashed
  roles: string[];
  specialTitle?: string;
  rank: number;
  xp: number;
  streakDays: number;
  isVerified: boolean;
  createdAt: Date;
  lastLogin: Date;
}

// Demo Users Database
export const USERS: User[] = [
  {
    id: '1',
    email: 'petar.jurkovic666@gmail.com',
    nickname: 'PetarJB',
    password: 'petar123', // Demo password
    roles: ['founder'],
    specialTitle: 'CEO',
    rank: 7,
    xp: 7450,
    streakDays: 15,
    isVerified: true,
    createdAt: new Date('2025-01-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'demo@ib.com',
    nickname: 'DemoUser',
    password: 'demo123',
    roles: ['polaznik'],
    rank: 2,
    xp: 500,
    streakDays: 5,
    isVerified: false,
    createdAt: new Date('2026-01-15'),
    lastLogin: new Date(),
  },
  {
    id: '3',
    email: 'admin@ib.com',
    nickname: 'AdminIB',
    password: 'admin123',
    roles: ['admin'],
    rank: 6,
    xp: 5000,
    streakDays: 30,
    isVerified: true,
    createdAt: new Date('2025-06-01'),
    lastLogin: new Date(),
  },
];

// Login function
export function loginUser(email: string, password: string): { success: boolean; user?: User; message: string } {
  const user = USERS.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'Korisnik sa ovim email-om ne postoji.' };
  }
  
  if (user.password !== password) {
    return { success: false, message: 'Pogrešna šifra.' };
  }
  
  // Update last login
  user.lastLogin = new Date();
  
  return { 
    success: true, 
    user: { ...user, password: undefined }, // Don't return password
    message: 'Uspešno ste se prijavili!' 
  };
}

// Register function
export function registerUser(email: string, password: string, nickname: string): { success: boolean; user?: User; message: string } {
  // Check if email exists
  if (USERS.find(u => u.email === email)) {
    return { success: false, message: 'Email je već registrovan.' };
  }
  
  // Check if nickname exists
  if (USERS.find(u => u.nickname === nickname)) {
    return { success: false, message: 'Nickname je zauzet.' };
  }
  
  const newUser: User = {
    id: String(USERS.length + 1),
    email,
    nickname,
    password,
    roles: ['polaznik'], // Default role
    rank: 1,
    xp: 0,
    streakDays: 0,
    isVerified: false,
    createdAt: new Date(),
    lastLogin: new Date(),
  };
  
  USERS.push(newUser);
  
  return { 
    success: true, 
    user: { ...newUser, password: undefined },
    message: 'Uspešno ste se registrovali!' 
  };
}

// Get user by email (for session)
export function getUserByEmail(email: string): User | undefined {
  const user = USERS.find(u => u.email === email);
  return user ? { ...user, password: undefined } : undefined;
}

// Get user by ID
export function getUserById(id: string): User | undefined {
  const user = USERS.find(u => u.id === id);
  return user ? { ...user, password: undefined } : undefined;
}

// Check if user is founder
export function isFounder(email: string): boolean {
  const user = USERS.find(u => u.email === email);
  return user?.roles.includes('founder') || false;
}

// Update user role (admin function)
export function updateUserRole(userId: string, newRoles: string[]): { success: boolean; message: string } {
  const user = USERS.find(u => u.id === userId);
  if (!user) {
    return { success: false, message: 'Korisnik ne postoji.' };
  }
  
  user.roles = newRoles;
  return { success: true, message: 'Uloge su uspešno ažurirane.' };
}

// Get founder info
export function getFounderInfo() {
  const founder = USERS.find(u => u.roles.includes('founder'));
  return founder ? {
    email: founder.email,
    nickname: founder.nickname,
    id: founder.id,
  } : null;
}
