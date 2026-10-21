import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, requireStaff, AuthRequest } from '../middleware/auth';

const router = Router();

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createPatientSchema = z.object({
  userId: z.number().int().positive(),
  dateOfBirth: z.string().optional().nullable(),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
});

const updatePatientSchema = z.object({
  dateOfBirth: z.string().optional().nullable(),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
});

const patientUserSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  createdAt: true,
};

// GET /api/patients/ (staff only) - list all patients
router.get('/', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: patientUserSelect } },
    });
    res.json(patients);
  } catch (error) {
    console.error('[Patients] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// GET /api/patients/me (authenticated) - patient's own profile
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.userId },
      include: { user: { select: patientUserSelect } },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('[Patients] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});

// PUT /api/patients/me (authenticated) - update own profile
router.put('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = updatePatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.patient.findUnique({ where: { userId: req.userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const data: { dateOfBirth?: Date | null; phone?: string; address?: string } = {};
    if (parsed.data.dateOfBirth !== undefined) {
      data.dateOfBirth = parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null;
    }
    if (parsed.data.phone !== undefined) data.phone = parsed.data.phone;
    if (parsed.data.address !== undefined) data.address = parsed.data.address;

    const patient = await prisma.patient.update({
      where: { userId: req.userId },
      data,
      include: { user: { select: patientUserSelect } },
    });
    res.json(patient);
  } catch (error) {
    console.error('[Patients] Error:', error);
    res.status(500).json({ error: 'Failed to update patient profile' });
  }
});

// POST /api/patients/ (staff only) - register a new patient profile for an existing user
router.post('/', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsed = createPatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const existingProfile = await prisma.patient.findUnique({ where: { userId: parsed.data.userId } });
    if (existingProfile) {
      return res.status(400).json({ error: 'Patient profile already exists for this user' });
    }

    const patient = await prisma.patient.create({
      data: {
        userId: parsed.data.userId,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        phone: parsed.data.phone ?? '',
        address: parsed.data.address ?? '',
      },
      include: { user: { select: patientUserSelect } },
    });
    res.status(201).json(patient);
  } catch (error) {
    console.error('[Patients] Error:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// GET /api/patients/:id (staff only) - get a single patient record
router.get('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parsedParams.data.id },
      include: { user: { select: patientUserSelect } },
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('[Patients] Error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// PUT /api/patients/:id (staff only) - update a patient record
router.put('/:id', authMiddleware, requireStaff, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }
  const parsed = updatePatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }
  try {
    const existing = await prisma.patient.findUnique({ where: { id: parsedParams.data.id } });
    if (!existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    const data: { dateOfBirth?: Date | null; phone?: string; address?: string } = {};
    if (parsed.data.dateOfBirth !== undefined) {
      data.dateOfBirth = parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null;
    }
    if (parsed.data.phone !== undefined) data.phone = parsed.data.phone;
    if (parsed.data.address !== undefined) data.address = parsed.data.address;

    const patient = await prisma.patient.update({
      where: { id: parsedParams.data.id },
      data,
      include: { user: { select: patientUserSelect } },
    });
    res.json(patient);
  } catch (error) {
    console.error('[Patients] Error:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

export default router;