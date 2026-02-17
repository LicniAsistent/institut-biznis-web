// Quick script to set Mladi_Preduzetnik as founder
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Finding users...');
  
  // Find Mladi_Preduzetnik
  const founder = await prisma.user.findFirst({
    where: { nickname: 'Mladi_Preduzetnik' }
  });
  
  if (founder) {
    console.log('Found founder:', founder.email);
    
    // Update to founder
    await prisma.user.update({
      where: { id: founder.id },
      data: {
        rankLevel: 11,
        role: 'founder',
        verified: true,
        bio: 'Founder & CEO - Vlasnik platforme',
        industry: 'Osnivač',
      }
    });
    console.log('✓ Mladi_Preduzetnik set as FOUNDER');
  } else {
    console.log('User Mladi_Preduzetnik not found');
  }
  
  // Find Tester023
  const tester = await prisma.user.findFirst({
    where: { nickname: 'Tester023' }
  });
  
  if (tester) {
    console.log('Found tester:', tester.email);
    await prisma.user.update({
      where: { id: tester.id },
      data: {
        rankLevel: 1,
        role: 'polaznik',
        bio: 'Novi korisnik - test nalog',
      }
    });
    console.log('✓ Tester023 updated as regular user');
  } else {
    console.log('User Tester023 not found');
  }
  
  console.log('\nDone!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
