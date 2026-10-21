import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const safeUserSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const createInvoiceSchema = z.object({
  userId: z.number().int().positive(),
  examId: z.number().int().positive(),
  totalAmount: z.number().nonnegative(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

async function getRequesterRole(userId: number): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return user ? user.role : null;
}

// GET /api/invoices/
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const role = await getRequesterRole(req.userId!);
    if (!role) {
      return res.status(401).json({ error: 'User not found' });
    }

    const where = role === 'patient' ? { userId: req.userId } : {};

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: safeUserSelect },
        createdBy: { select: safeUserSelect },
        exam: {
          include: {
            patient: {
              include: {
                user: { select: safeUserSelect },
              },
            },
          },
        },
      },
    });

    res.json(invoices);
  } catch (error) {
    console.error('[Invoices] Error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/invoices/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsedParams = idParamSchema.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: 'Invalid id', code: 'validation_error', issues: parsedParams.error.issues });
  }

  try {
    const role = await getRequesterRole(req.userId!);
    if (!role) {
      return res.status(401).json({ error: 'User not found' });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: parsedParams.data.id },
      include: {
        user: { select: safeUserSelect },
        createdBy: { select: safeUserSelect },
        exam: {
          include: {
            patient: {
              include: {
                user: { select: safeUserSelect },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (role === 'patient' && invoice.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to view this invoice' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('[Invoices] Error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// POST /api/invoices/ (billing staff only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createInvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid body', code: 'validation_error', issues: parsed.error.issues });
  }

  try {
    const role = await getRequesterRole(req.userId!);
    if (!role) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (role !== 'billing') {
      return res.status(403).json({ error: 'Only billing staff can create invoices' });
    }

    const patientUser = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
    if (!patientUser || patientUser.role !== 'patient') {
      return res.status(400).json({ error: 'userId must reference a patient user' });
    }

    const exam = await prisma.exam.findUnique({ where: { id: parsed.data.examId } });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const existingInvoice = await prisma.invoice.findFirst({ where: { examId: parsed.data.examId } });
    if (existingInvoice) {
      return res.status(400).json({ error: 'This exam already has an invoice' });
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId: parsed.data.userId,
        examId: parsed.data.examId,
        totalAmount: parsed.data.totalAmount,
        createdById: req.userId,
        status: 'pending',
        stripePaymentIntentId: '',
      },
      include: {
        user: { select: safeUserSelect },
        createdBy: { select: safeUserSelect },
        exam: {
          include: {
            patient: {
              include: {
                user: { select: safeUserSelect },
              },
            },
          },
        },
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error('[Invoices] Error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

export default router;
