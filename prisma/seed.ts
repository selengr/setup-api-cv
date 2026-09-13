import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phone = '09381329963';
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    console.log('Seed user already exists:', existing.slug);
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: 'Hesam Demo',
      phone,
      slug: 'hesam-demo',
      profile: {
        create: {
          headline: 'Full-stack developer',
          summary: 'Sample portfolio seeded for local demo.',
          location: 'Tehran',
          email: 'demo@example.com',
          experiences: {
            create: [
              {
                company: 'Demo Co',
                title: 'Backend Developer',
                startDate: '2021-01',
                endDate: '2023-06',
                description: 'Node.js APIs and auth flows',
              },
            ],
          },
          educations: {
            create: [
              {
                school: 'Demo University',
                degree: 'BSc',
                field: 'Computer Science',
                startDate: '2016',
                endDate: '2020',
              },
            ],
          },
          skills: {
            create: [
              { name: 'TypeScript', level: 'advanced' },
              { name: 'Node.js', level: 'advanced' },
              { name: 'Prisma', level: 'intermediate' },
            ],
          },
          projects: {
            create: [
              {
                name: 'portfolio-api',
                url: 'https://github.com/selengr/portfolio-api',
                description: 'Portfolio / resume REST API with OTP auth',
                techStack: 'Express, TypeScript, Prisma, SQLite',
              },
            ],
          },
        },
      },
    },
  });

  console.log('Seeded user:', user.slug, user.phone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
