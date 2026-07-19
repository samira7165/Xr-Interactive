import { z } from 'zod'

export const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Tell us a bit more about your project'),
})

export const LoginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const SignupSchema = z.object({
  name: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const SettingsSchema = z.object({
  name: z.string().trim().optional().or(z.literal('')),
  image: z.string().trim().optional().or(z.literal('')),
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().optional().or(z.literal('')),
})

export const PostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  excerpt: z.string().trim().min(1, 'Excerpt is required'),
  body: z.string().trim().optional().or(z.literal('')),
  category: z.string().trim().min(1, 'Category is required'),
  image: z.string().trim().min(1, 'Image URL is required'),
  published: z.coerce.boolean(),
})

export const ProjectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  description: z.string().trim().min(1, 'Description is required'),
  category: z.enum(['VR', 'AR', 'Event', 'Campaign'], { message: 'Select a category' }),
  thumbnail: z.string().trim().min(1, 'Thumbnail URL is required'),
  techStack: z.string().trim().optional().or(z.literal('')),
  featured: z.coerce.boolean(),
})

export const TeamMemberSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  role: z.string().trim().min(1, 'Role is required'),
  bio: z.string().trim().min(1, 'Bio is required'),
  image: z.string().trim().optional().or(z.literal('')),
  twitter: z.string().trim().optional().or(z.literal('')),
  linkedin: z.string().trim().optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
})

export const ServiceSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  icon: z.string().trim().min(1, 'Icon is required'),
  tag: z.string().trim().optional().or(z.literal('')),
  gradient: z.string().trim().optional().or(z.literal('')),
  features: z.string().trim().optional().or(z.literal('')),
  images: z.string().trim().optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
})

export const ClientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  logo: z.string().trim().min(1, 'Logo URL is required'),
  website: z.string().trim().optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
})

export const JobSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  department: z.string().trim().optional().or(z.literal('')),
  location: z.string().trim().min(1, 'Location is required'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], { message: 'Select a job type' }),
  level: z.string().trim().optional().or(z.literal('')),
  compensation: z.string().trim().optional().or(z.literal('')),
  description: z.string().trim().min(1, 'Description is required'),
  responsibilities: z.string().trim().optional().or(z.literal('')),
  requirements: z.string().trim().optional().or(z.literal('')),
  images: z.string().trim().optional().or(z.literal('')),
  active: z.coerce.boolean(),
})

export const ApplicationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  country: z.string().trim().min(1, 'Country is required'),
  linkedin: z.string().trim().optional().or(z.literal('')),
  resumeUrl: z.string().trim().min(1, 'Please upload your CV'),
})
