import { Grid, Stat } from '../components/ui';
import type { Exam, Invoice } from '../types';

interface PatientDashboardStatsProps {
  exams: Exam[];
  invoices: Invoice[];
}

export default function PatientDashboardStats({ exams, invoices }: PatientDashboardStatsProps) {
  const upcomingCount = exams.filter((e) => e.status === 'scheduled').length;
  const completedCount = exams.filter((e) => e.status === 'completed').length;
  const pendingInvoices = invoices.filter((inv) => inv.status === 'pending');
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const paidTotal = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

  return (
    <Grid size="sm" cols={4}>
      <Stat
        icon="calendar"
        value={String(upcomingCount)}
        label="Upcoming X-ray exams"
      />
      <Stat
        icon="check"
        value={String(completedCount)}
        label="Completed exams"
      />
      <Stat
        icon="credit-card"
        value={`$${Number(pendingTotal || 0).toFixed(2)}`}
        label={`Balance due (${pendingInvoices.length} invoice${pendingInvoices.length === 1 ? '' : 's'})`}
      />
      <Stat
        icon="dollar"
        value={`$${Number(paidTotal || 0).toFixed(2)}`}
        label="Total paid to date"
      />
    </Grid>
  );
}
