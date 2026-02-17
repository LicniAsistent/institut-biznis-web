// Database Update Script for Institut Biznis Platform
// Run this to set up initial admin users

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Setting up admin users...\n');

  // Find and update Mladi_Preduzetnik as founder
  console.log('1. Setting up Mladi_Preduzetnik as founder...');
  const founderUser = await prisma.user.findUnique({
    where: { nickname: 'Mladi_Preduzetnik' }
  });

  if (founderUser) {
    await prisma.user.update({
      where: { id: founderUser.id },
      data: {
        role: 'founder',
        rankLevel: 11,
        verified: true,
      }
    });
    console.log(`   ✓ Updated ${founderUser.email} to founder\n`);
  } else {
    console.log('   ⚠ User Mladi_Preduzetnik not found (will use demo user if exists)\n');
  }

  // Find and keep Tester023 as regular user
  console.log('2. Verifying Tester023 status...');
  const testerUser = await prisma.user.findUnique({
    where: { nickname: 'Tester023' }
  });

  if (testerUser) {
    await prisma.user.update({
      where: { id: testerUser.id },
      data: {
        role: 'polaznik', // Regular user
        verified: false,
      }
    });
    console.log(`   ✓ ${testerUser.email} confirmed as regular user (polaznik)\n`);
  } else {
    console.log('   ⚠ User Tester023 not found\n');
  }

  // Create demo founder if no users exist
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('3. Creating demo founder user...');
    await prisma.user.create({
      data: {
        email: 'petar.jurkovic666@gmail.com',
        nickname: 'PetarJB',
        fullName: 'Petar Jurković',
        role: 'founder',
        rankLevel: 11,
        xpPoints: 100000,
        verified: true,
        bio: 'Founder & CEO of Institut Biznis',
      }
    });
    console.log('   ✓ Created demo founder: petar.jurkovic666@gmail.com\n');
  }

  console.log('✅ Database setup complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
