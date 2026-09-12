import { prisma } from '../../db/prisma';
import { AppError } from '../../middleware/errorHandler';

const cvInclude = {
  experiences: { orderBy: { id: 'desc' as const } },
  educations: { orderBy: { id: 'desc' as const } },
  skills: { orderBy: { id: 'asc' as const } },
  projects: { orderBy: { id: 'desc' as const } },
};

async function getOrCreateProfile(userId: number) {
  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.profile.create({ data: { userId } });
}

export async function getMyCv(userId: number) {
  await getOrCreateProfile(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phone: true,
      slug: true,
      profile: { include: cvInclude },
    },
  });
  return user;
}

export async function getPublicCv(slug: string) {
  const user = await prisma.user.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      profile: {
        select: {
          headline: true,
          summary: true,
          location: true,
          website: true,
          email: true,
          experiences: {
            select: {
              company: true,
              title: true,
              location: true,
              startDate: true,
              endDate: true,
              description: true,
            },
            orderBy: { id: 'desc' },
          },
          educations: {
            select: {
              school: true,
              degree: true,
              field: true,
              startDate: true,
              endDate: true,
              description: true,
            },
            orderBy: { id: 'desc' },
          },
          skills: { select: { name: true, level: true }, orderBy: { id: 'asc' } },
          projects: {
            select: {
              name: true,
              url: true,
              description: true,
              techStack: true,
            },
            orderBy: { id: 'desc' },
          },
        },
      },
    },
  });

  if (!user || !user.profile) {
    throw new AppError('CV not found', 404);
  }

  return {
    name: user.name,
    slug: user.slug,
    ...user.profile,
  };
}

export async function updateProfile(userId: number, data: Record<string, unknown>) {
  const profile = await getOrCreateProfile(userId);
  return prisma.profile.update({
    where: { id: profile.id },
    data: {
      headline: (data.headline as string | null | undefined) ?? undefined,
      summary: (data.summary as string | null | undefined) ?? undefined,
      location: (data.location as string | null | undefined) ?? undefined,
      website: data.website === '' ? null : (data.website as string | null | undefined),
      email: data.email === '' ? null : (data.email as string | null | undefined),
    },
  });
}

export async function addExperience(userId: number, data: {
  company: string;
  title: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
}) {
  const profile = await getOrCreateProfile(userId);
  return prisma.experience.create({ data: { ...data, profileId: profile.id } });
}

export async function updateExperience(
  userId: number,
  id: number,
  data: Partial<{
    company: string;
    title: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    description: string | null;
  }>
) {
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) throw new AppError('not found', 404);
  await assertOwns(userId, item.profileId);
  return prisma.experience.update({ where: { id }, data });
}

export async function updateEducation(
  userId: number,
  id: number,
  data: Partial<{
    school: string;
    degree: string | null;
    field: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
  }>
) {
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) throw new AppError('not found', 404);
  await assertOwns(userId, item.profileId);
  return prisma.education.update({ where: { id }, data });
}

export async function addEducation(userId: number, data: {
  school: string;
  degree?: string | null;
  field?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}) {
  const profile = await getOrCreateProfile(userId);
  return prisma.education.create({ data: { ...data, profileId: profile.id } });
}

export async function addSkill(userId: number, data: { name: string; level?: string | null }) {
  const profile = await getOrCreateProfile(userId);
  return prisma.skill.create({ data: { ...data, profileId: profile.id } });
}

export async function addProject(userId: number, data: {
  name: string;
  url?: string | null;
  description?: string | null;
  techStack?: string | null;
}) {
  const profile = await getOrCreateProfile(userId);
  return prisma.project.create({
    data: {
      ...data,
      url: data.url === '' ? null : data.url,
      profileId: profile.id,
    },
  });
}

async function assertOwns(userId: number, profileId: number) {
  const profile = await prisma.profile.findFirst({ where: { id: profileId, userId } });
  if (!profile) throw new AppError('not found', 404);
}

export async function deleteExperience(userId: number, id: number) {
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) throw new AppError('not found', 404);
  await assertOwns(userId, item.profileId);
  await prisma.experience.delete({ where: { id } });
}

export async function deleteEducation(userId: number, id: number) {
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) throw new AppError('not found', 404);
  await assertOwns(userId, item.profileId);
  await prisma.education.delete({ where: { id } });
}

export async function deleteSkill(userId: number, id: number) {
  const item = await prisma.skill.findUnique({ where: { id } });
  if (!item) throw new AppError('not found', 404);
  await assertOwns(userId, item.profileId);
  await prisma.skill.delete({ where: { id } });
}

export async function deleteProject(userId: number, id: number) {
  const item = await prisma.project.findUnique({ where: { id } });
  if (!item) throw new AppError('not found', 404);
  await assertOwns(userId, item.profileId);
  await prisma.project.delete({ where: { id } });
}
