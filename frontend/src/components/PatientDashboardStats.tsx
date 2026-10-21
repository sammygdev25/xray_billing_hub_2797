import { Grid, Stat } from '../components/ui';
import { Icon } from '../components/icons';
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
        icon={<Icon name="calendar" />}
        value={String(upcomingCount)}
        label="Upcoming X-ray exams"
      />
      <Stat
        icon={<Icon name="check" />}
        value={String(completedCount)}
        label="Completed exams"
      />
      <Stat
        icon={<Icon name="credit-card" />}
        value={`$${pendingTotal.toFixed(2)}`}
        label={`Balance due (${pendingInvoices.length} invoice${pendingInvoices.length === 1 ? '' : 's'})`}
      />
      <Stat
        icon={<Icon name="dollar" />}
        value={`$${paidTotal.toFixed(2)}`}
        label="Total paid to date"
      />
    </Grid>
  );
}