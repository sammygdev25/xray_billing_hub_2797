import { Grid, Stat } from '../components/ui';

interface StaffDashboardStatsProps {
  totalPatients: number;
  scheduledExams: number;
  pendingInvoices: number;
  revenueCollected: number;
}

export default function StaffDashboardStats({
  totalPatients,
  scheduledExams,
  pendingInvoices,
  revenueCollected,
}: StaffDashboardStatsProps) {
  return (
    <section className="ds-section">
      <div className="ds-container">
        <Grid size="sm" cols={4}>
          <Stat
            icon="users"
            value={String(totalPatients)}
            label="Registered Patients"
          />
          <Stat
            icon="calendar"
            value={String(scheduledExams)}
            label="Scheduled Exams"
          />
          <Stat
            icon="credit-card"
            value={String(pendingInvoices)}
            label="Pending Invoices"
          />
          <Stat
            icon="dollar"
            value={`$${Number(revenueCollected || 0).toFixed(2)}`}
            label="Revenue Collected"
          />
        </Grid>
      </div>
    </section>
  );
}
