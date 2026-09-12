import { z } from 'zod';

export const profileSchema = z.object({
  headline: z.string().max(160).optional().nullable(),
  summary: z.string().max(5000).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  email: z.string().email().optional().nullable().or(z.literal('')),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional().nullable(),
  startDate: z.string().min(4),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  level: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable(),
  techStack: z.string().optional().nullable(),
});
