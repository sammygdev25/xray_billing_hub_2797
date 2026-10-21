import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // A seeded database is never seeded twice (the image runs this on every boot with SEED_DEMO=1).
  if ((await prisma.user.count()) > 0 && process.env.SEED_FORCE !== '1') {
    console.log('Seed skipped: the database already has users (SEED_FORCE=1 seeds anyway).');
    return;
  }

  // Create demo user
  // The demo password is this project's own (SEED_DEMO_PASSWORD in backend/.env, made at generation, never shipped):
  // no generated app shares a known password. Without it there are no demo accounts and no demo data.
  const demoPassword = process.env.SEED_DEMO_PASSWORD || '';
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD is not set: no demo accounts and no demo data.');
    return;
  }
  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { isStaff: true },
    create: {
      isStaff: true,
      username: 'demo',
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
    },
  });

  // Create demo staff user (staff, the same demo password)
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      username: 'staff',
      email: 'staff@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'Staff',
      isStaff: true,
    },
  });

  // Domain seed data
  try {
    await prisma.patient.create({ data: { userId: 1, dateOfBirth: new Date(), phone: '555-201-3847', address: '412 Maple Street, Springfield, IL 62701' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-384-2910', address: '87 Birchwood Lane, Austin, TX 73301' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-672-4521', address: '2309 Oakridge Drive, Denver, CO 80202' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-918-3344', address: '56 Lakeview Court, Tampa, FL 33602' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-203-7765', address: '1450 Elm Avenue, Portland, OR 97201' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-449-8821', address: '78 Riverside Blvd, Nashville, TN 37203' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-662-1198', address: '330 Cedar Hill Road, Columbus, OH 43215' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-775-6632', address: '19 Hilltop Terrace, Phoenix, AZ 85004' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-890-4471', address: '604 Willow Way, Charlotte, NC 28202' } });
    await prisma.patient.create({ data: { userId: 2, dateOfBirth: new Date(), phone: '555-312-9087', address: '245 Pinecrest Ave, Seattle, WA 98101' } });
  } catch (e) { console.warn('[seed] Patient skipped:', e); }
  try {
    await prisma.exam.create({ data: { patientId: 1, examType: 'Chest X-ray', scheduledById: 1, radiologistId: 1, scheduledAt: new Date(), status: 'active', studyNotes: 'Mild opacity noted in lower left lobe, recommend follow-up in 4 weeks.', price: 19.99 } });
    await prisma.exam.create({ data: { patientId: 2, examType: 'Lumbar Spine X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'No fractures detected, mild disc space narrowing at L4-L5.', price: 29.99 } });
    await prisma.exam.create({ data: { patientId: 3, examType: 'Wrist X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'Hairline fracture of distal radius confirmed, cast recommended.', price: 39.99 } });
    await prisma.exam.create({ data: { patientId: 4, examType: 'Abdominal X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'No obstruction visible, bowel gas pattern within normal limits.', price: 49.99 } });
    await prisma.exam.create({ data: { patientId: 5, examType: 'Knee X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'Moderate joint space narrowing consistent with early osteoarthritis.', price: 59.99 } });
    await prisma.exam.create({ data: { patientId: 6, examType: 'Shoulder X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'No dislocation, mild degenerative changes at acromioclavicular joint.', price: 69.99 } });
    await prisma.exam.create({ data: { patientId: 7, examType: 'Pelvis X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'No acute fracture, incidental calcification noted in soft tissue.', price: 79.99 } });
    await prisma.exam.create({ data: { patientId: 8, examType: 'Cervical Spine X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'Slight loss of normal lordotic curve, no instability observed.', price: 89.99 } });
    await prisma.exam.create({ data: { patientId: 9, examType: 'Foot X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'Small bone spur at calcaneus, no fracture lines identified.', price: 99.99 } });
    await prisma.exam.create({ data: { patientId: 10, examType: 'Ankle X-ray', scheduledById: 2, radiologistId: 2, scheduledAt: new Date(), status: 'active', studyNotes: 'Soft tissue swelling present, no fracture detected on imaging.', price: 109.99 } });
  } catch (e) { console.warn('[seed] Exam skipped:', e); }
  try {
    await prisma.invoice.create({ data: { userId: 1, examId: 1, createdById: 1, totalAmount: 19.99, status: 'active', stripePaymentIntentId: '1' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 29.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 39.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 49.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 59.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 69.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 79.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 89.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 99.99, status: 'active', stripePaymentIntentId: '2' } });
    await prisma.invoice.create({ data: { userId: 2, examId: 2, createdById: 2, totalAmount: 109.99, status: 'active', stripePaymentIntentId: '2' } });
  } catch (e) { console.warn('[seed] Invoice skipped:', e); }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
