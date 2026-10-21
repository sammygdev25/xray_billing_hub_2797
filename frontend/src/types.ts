/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── User ──
export interface User {
  id: number;
  email: string;
  passwordHash: string | null;
  fullName: string;
  role: string;
  googleId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const UserSchema = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  passwordHash: z.string().nullable(),
  fullName: z.string(),
  role: z.string(),
  googleId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Patient ──
export interface Patient {
  id: number;
  user?: User;
  userId: number;
  dateOfBirth: string | null;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export const PatientSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  dateOfBirth: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Exam ──
export interface Exam {
  id: number;
  patient?: Patient;
  patientId: number;
  examType: string;
  scheduledBy?: User | null;
  scheduledById: number | null;
  radiologist?: User | null;
  radiologistId: number | null;
  scheduledAt: string;
  status: string;
  studyNotes: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export const ExamSchema = z.object({
  id: z.coerce.number(),
  patient: z.custom<Patient>((v) => typeof v === 'object' && v !== null).optional(),
  patientId: z.coerce.number().int(),
  examType: z.string(),
  scheduledBy: z.custom<User>((v) => typeof v === 'object' && v !== null).nullable().optional(),
  scheduledById: z.coerce.number().int().nullable(),
  radiologist: z.custom<User>((v) => typeof v === 'object' && v !== null).nullable().optional(),
  radiologistId: z.coerce.number().int().nullable(),
  scheduledAt: z.string(),
  status: z.string(),
  studyNotes: z.string(),
  price: z.coerce.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Invoice ──
export interface Invoice {
  id: number;
  user?: User;
  userId: number;
  exam?: Exam;
  examId: number;
  createdBy?: User | null;
  createdById: number | null;
  totalAmount: number;
  status: string;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const InvoiceSchema = z.object({
  id: z.coerce.number(),
  user: z.custom<User>((v) => typeof v === 'object' && v !== null).optional(),
  userId: z.coerce.number().int(),
  exam: z.custom<Exam>((v) => typeof v === 'object' && v !== null).optional(),
  examId: z.coerce.number().int(),
  createdBy: z.custom<User>((v) => typeof v === 'object' && v !== null).nullable().optional(),
  createdById: z.coerce.number().int().nullable(),
  totalAmount: z.coerce.number(),
  status: z.string(),
  stripePaymentIntentId: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

