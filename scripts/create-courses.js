const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating demo courses...');

  // Course 1: Auto Detailing Osnovni
  const course1 = await prisma.course.upsert({
    where: { slug: 'auto-detailing-osnovni' },
    update: {},
    create: {
      title: 'Auto Detailing Osnovni',
      slug: 'auto-detailing-osnovni',
      description: 'Naučite osnve auto detailing-a i započnite sopstveni posao. Kompletan kurs od pripreme do završne политуре.',
      price: 4999,
      thumbnail: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800',
      published: true
    }
  });

  // Lessons for Course 1
  const lessons1 = [
    { title: 'Uvod u Auto Detailing', description: 'Šta je auto detailing i zašto je važan', duration: 15, order: 1 },
    { title: 'Pranje i Decontaminacija', description: 'Tehnike pranja i uklanjanje kontaminanata', duration: 25, order: 2 },
    { title: 'Poliranje Lak', description: 'Kako ispolirati auto lak profesionalno', duration: 35, order: 3 },
    { title: 'Zaštita Laka', description: 'Nano keramika, vosak i sealanti', duration: 20, order: 4 },
    { title: 'Unutrašnjost', description: 'Čišćenje i održavanje enterijera', duration: 30, order: 5 },
  ];

  for (const lesson of lessons1) {
    await prisma.lesson.upsert({
      where: { id: `${course1.id}-lesson-${lesson.order}` },
      update: {},
      create: {
        id: `${course1.id}-lesson-${lesson.order}`,
        courseId: course1.id,
        ...lesson
      }
    });
  }

  // Course 2: Biznis Od Nule
  const course2 = await prisma.course.upsert({
    where: { slug: 'biznis-od-nule' },
    update: {},
    create: {
      title: 'Biznis Od Nule',
      slug: 'biznis-od-nule',
      description: 'Kompletan vodič za pokretanje sopstvenog biznisa. Od ideje do prvog klijenta.',
      price: 4999,
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
      published: true
    }
  });

  // Lessons for Course 2
  const lessons2 = [
    { title: 'Pronalaženje Ideje', description: 'Kako pronaći profitabilnu nišu', duration: 20, order: 1 },
    { title: 'Istraživanje Tržišta', description: 'Analiza konkurencije i ciljne grupe', duration: 25, order: 2 },
    { title: 'Biznis Plan', description: 'Pisanje biznis plana korak po korak', duration: 30, order: 3 },
    { title: 'Pravna Priprema', description: 'Registracija, dozvole i poreske obaveze', duration: 25, order: 4 },
    { title: 'Prvi Klijenti', description: 'Kako doći do prvih mušterija', duration: 20, order: 5 },
  ];

  for (const lesson of lessons2) {
    await prisma.lesson.upsert({
      where: { id: `${course2.id}-lesson-${lesson.order}` },
      update: {},
      create: {
        id: `${course2.id}-lesson-${lesson.order}`,
        courseId: course2.id,
        ...lesson
      }
    });
  }

  // Course 3: Marketing za Male Biznise
  const course3 = await prisma.course.upsert({
    where: { slug: 'marketing-za-biznise' },
    update: {},
    create: {
      title: 'Marketing za Male Biznise',
      slug: 'marketing-za-biznise',
      description: 'Digitalni marketing bez velikog budžeta. Instagram, Facebook, Google my Business.',
      price: 3999,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      published: true
    }
  });

  // Lessons for Course 3
  const lessons3 = [
    { title: 'Osnove Digitalnog Marketinga', description: 'Uvod u svet digitalnog marketinga', duration: 15, order: 1 },
    { title: 'Instagram za Biznis', description: 'Kako privući pratioce i klijente', duration: 25, order: 2 },
    { title: 'Facebook Strategije', description: 'Reklamiranje bez velikog budžeta', duration: 30, order: 3 },
    { title: 'Google My Business', description: 'Lokalni SEO i Google mape', duration: 20, order: 4 },
  ];

  for (const lesson of lessons3) {
    await prisma.lesson.upsert({
      where: { id: `${course3.id}-lesson-${lesson.order}` },
      update: {},
      create: {
        id: `${course3.id}-lesson-${lesson.order}`,
        courseId: course3.id,
        ...lesson
      }
    });
  }

  console.log('✅ Demo courses created!');
  console.log(`   - ${course1.title}: ${course1.price} RSD`);
  console.log(`   - ${course2.title}: ${course2.price} RSD`);
  console.log(`   - ${course3.title}: ${course3.price} RSD`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
