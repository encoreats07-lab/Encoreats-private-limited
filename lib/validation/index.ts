import { z } from "zod";

// Flexible URL/Link helper that permits social handles and domains without http://
const flexibleUrlSchema = z.string().transform((val) => {
  if (!val || val.trim() === "") return "";
  const trimmed = val.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}).pipe(z.string().url("Valid URL or handle required"));

const optionalFlexibleUrlSchema = z.string().optional().transform((val) => {
  if (!val || val.trim() === "") return undefined;
  const trimmed = val.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  interests: z.array(z.string()).optional(),
  referralCode: z.string().optional(),
  honeypot: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
  honeypot: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  honeypot: z.string().optional(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token or OTP code is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const earlyAccessSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  interests: z.array(z.string()).min(1, "Select at least one cultural interest"),
  referralCode: z.string().optional(),
  honeypot: z.string().optional(),
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;

export const artistApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Valid contact phone number required"),
  city: z.string().min(2, "City is required"),
  discipline: z.string().min(2, "Discipline is required"),
  bio: z.string().min(10, "Biography must be at least 10 characters"),
  portfolioUrl: flexibleUrlSchema,
  websiteUrl: optionalFlexibleUrlSchema,
  experienceDesc: z.string().min(15, "Describe your experience concept"),
  fileUrls: z.array(z.string()).optional(),
  honeypot: z.string().optional(),
});

export type ArtistApplicationInput = z.infer<typeof artistApplicationSchema>;

export const venueApplicationSchema = z.object({
  venueName: z.string().min(2, "Venue name is required"),
  contactName: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  venueType: z.string().min(2, "Venue type is required"),
  capacity: z.string().min(1, "Seated capacity is required"),
  websiteUrl: flexibleUrlSchema,
  venueDesc: z.string().min(15, "Provide a description of space and atmosphere"),
  fileUrls: z.array(z.string()).optional(),
  honeypot: z.string().optional(),
});

export type VenueApplicationInput = z.infer<typeof venueApplicationSchema>;

export const hostApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  city: z.string().min(2, "City is required"),
  conceptTitle: z.string().min(3, "Concept title is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(20, "Provide a detailed description of the host experience"),
  targetAudience: z.string().optional(),
  estimatedCapacity: z.string().min(1, "Estimated capacity is required"),
  websiteUrl: optionalFlexibleUrlSchema,
  fileUrls: z.array(z.string()).optional(),
  honeypot: z.string().optional(),
});

export type HostApplicationInput = z.infer<typeof hostApplicationSchema>;
