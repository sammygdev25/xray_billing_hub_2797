import { Grid, Stat } from './ui';

interface StatsSummaryStats {
  totalPatients?: number;
  totalExams?: number;
  scheduledExams?: number;
  pendingInvoices?: number;
  paidInvoices?: number;
  totalRevenue?: number;
}

interface StatsSummaryProps {
  stats: StatsSummaryStats;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function StatsSummary({ stats }: StatsSummaryProps) {
  const {
    totalPatients = 0,
    totalExams = 0,
    scheduledExams = 0,
    pendingInvoices = 0,
    paidInvoices = 0,
    totalRevenue = 0,
  } = stats || {};

  return (
    <Grid size="sm" cols={3}>
      <Stat value={totalPatients} label="Registered patients" icon="users" />
      <Stat value={totalExams} label="Total exams" icon="package" />
      <Stat value={scheduledExams} label="Scheduled exams" icon="calendar" />
      <Stat value={pendingInvoices} label="Pending invoices" icon="credit-card" />
      <Stat value={paidInvoices} label="Paid invoices" icon="check" />
      <Stat value={formatCurrency(totalRevenue)} label="Total revenue" icon="dollar" />
    </Grid>
  );
}

export default StatsSummary;
export { StatsSummary };