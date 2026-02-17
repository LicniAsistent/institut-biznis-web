const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find by email
  const user = await prisma.user.findFirst({
    where: { email: 'petar.jurkovic666@gmail.com' }
  });
  
  if (user) {
    console.log('User found:', user.nickname);
    console.log('Current role:', user.role);
    console.log('Current rankLevel:', user.rankLevel);
    console.log('Verified:', user.verified);
    
    // Set as founder
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: 'founder',
        rankLevel: 11,
        verified: true,
        bio: 'Founder & CEO',
        industry: 'Osnivač'
      }
    });
    console.log('✅ Set as FOUNDER with rankLevel 11');
  } else {
    console.log('User not found!');
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
