import { Grid, Stat } from '../components/ui';
import { Icon } from '../components/icons';

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
            icon={<Icon name="users" />}
            value={String(totalPatients)}
            label="Registered Patients"
          />
          <Stat
            icon={<Icon name="calendar" />}
            value={String(scheduledExams)}
            label="Scheduled Exams"
          />
          <Stat
            icon={<Icon name="credit-card" />}
            value={String(pendingInvoices)}
            label="Pending Invoices"
          />
          <Stat
            icon={<Icon name="dollar" />}
            value={`$${revenueCollected.toFixed(2)}`}
            label="Revenue Collected"
          />
        </Grid>
      </div>
    </section>
  );
}