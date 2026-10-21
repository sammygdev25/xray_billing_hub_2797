import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const EXAM_STATUSES = ['scheduled', 'completed', 'cancelled'] as const;

const createExamSchema = z.object({
  patientId: z.number().int().positive(),
  examType: z.string().min(1),
  scheduledAt: z.string().min(1),
  radiologistId: z.number().int().positive().optional(),
  status: z.enum(EXAM_STATUSES).optional(),
  studyNotes: z.string().optional(),
  price: z.number().nonnegative(),
});

const updateExamSchema = z.object({
  examType: z.string().min(1).optional(),
  scheduledAt: z.string().min(1).optional(),
  radiologistId: z.number().int().positive().nullable().optional(),
  status: z.enum(EXAM_STATUSES).optional(),
  studyNotes: z.string().optional(),
  price: z.number().nonnegative().optional(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const listQuerySchema = z.object({
  status: z.enum(EXAM_STATUSES).optional(),
  patientId: z.coerce.number().int().positive().optional(),
});

async function getRequestingUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
}

function isStaffRole(role: string | undefined) {
  return role === 'receptionist' || role === 'radiologist' || role === 'billing';
}

const examInclude = {
  patient: { include: { user: true } },
  scheduledBy: true,
  radiologist: true,
};

// GET /api/exams/
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsedQuery = listQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ error: 'Invalid query', code: 'validation_error', issues: parsedQuery.error.issues });
  }
  try {
    const requester = await getRequestingUser(req.userId!);
    if (!requester) {
      return res.status(401).json({ error: 'User not found' });
    }

    const where: Record<string, unknown> = {};
    if (parsedQuery.data.status) {
      where.status = parsedQuery.data.status;
    }

    if (isStaffRole(requester.role)) {
      if (parsedQuery.data.patientId) {
        where.patientId = parsedQuery.data.patientId;
      }
    } else {
      const patient = await prisma.patient.findFirst({ where: { userId: requester.id } });
      if (!patient) {
        return res.json([]);
      }
      where.patientId = patient.id;
    }

    const exams = await prisma.exam.findMany({
      where,
      include: examInclude,
      orderBy: { scheduledAt: 'desc' },
    });
    res.json(exams);
  } catch (error) {
    console.error('[Exams] Error:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// GET /api/exams/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const requester = await getRequestingUser(req.userId!);
    if (!requester) {
      return res.status(401).json({ error: 'User not found' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: parsedParams.data.id },
      include: examInclude,
    });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (!isStaffRole(requester.role)) {
      const patient = await prisma.patient.findFirst({ where: { userId: requester.id } });
      if (!patient || exam.patientId !== patient.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    res.json(exam);
  } catch (error) {
    console.error('[Exams] Error:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// POST /api/exams/
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createExamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const requester = await getRequestingUser(req.userId!);
    if (!requester || !isStaffRole(requester.role)) {
      return res.status(403).json({ error: 'Only staff can schedule exams' });
    }

    const patient = await prisma.patient.findUnique({ where: { id: parsed.data.patientId } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (parsed.data.radiologistId) {
      const radiologist = await prisma.user.findUnique({ where: { id: parsed.data.radiologistId } });
      if (!radiologist || radiologist.role !== 'radiologist') {
        return res.status(400).json({ error: 'Invalid radiologist' });
      }
    }

    const exam = await prisma.exam.create({
      data: {
        patientId: parsed.data.patientId,
        examType: parsed.data.examType,
        scheduledAt: new Date(parsed.data.scheduledAt),
        status: parsed.data.status ?? 'scheduled',
        studyNotes: parsed.data.studyNotes ?? '',
        price: parsed.data.price,
        radiologistId: parsed.data.radiologistId,
        scheduledById: requester.id,
      },
      include: examInclude,
    });
    res.status(201).json(exam);
  } catch (error) {
    console.error('[Exams] Error:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// PATCH /api/exams/:id
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updateExamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const requester = await getRequestingUser(req.userId!);
    if (!requester || !isStaffRole(requester.role)) {
      return res.status(403).json({ error: 'Only staff can update exams' });
    }

    const existing = await prisma.exam.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    if (parsed.data.radiologistId) {
      const radiologist = await prisma.user.findUnique({ where: { id: parsed.data.radiologistId } });
      if (!radiologist || radiologist.role !== 'radiologist') {
        return res.status(400).json({ error: 'Invalid radiologist' });
      }
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.examType !== undefined) data.examType = parsed.data.examType;
    if (parsed.data.scheduledAt !== undefined) data.scheduledAt = new Date(parsed.data.scheduledAt);
    if (parsed.data.radiologistId !== undefined) data.radiologistId = parsed.data.radiologistId;
    if (parsed.data.status !== undefined) data.status = parsed.data.status;
    if (parsed.data.studyNotes !== undefined) data.studyNotes = parsed.data.studyNotes;
    if (parsed.data.price !== undefined) data.price = parsed.data.price;

    const exam = await prisma.exam.update({
      where: { id: parsedParams.data.id },
      data,
      include: examInclude,
    });
    res.json(exam);
  } catch (error) {
    console.error('[Exams] Error:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

export default router;