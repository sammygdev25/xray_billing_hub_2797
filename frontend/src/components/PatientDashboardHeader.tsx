import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientDashboardHeaderProps {
  userName: string;
  pendingInvoiceCount?: number;
}

export default function PatientDashboardHeader({ userName, pendingInvoiceCount = 0 }: PatientDashboardHeaderProps) {
  const firstName = userName?.split(' ')[0] || userName;

  return (
    <PageHeader
      eyebrow="Patient Portal"
      title={`Welcome back, ${firstName}`}
      subtitle={
        pendingInvoiceCount > 0
          ? `You have ${pendingInvoiceCount} invoice${pendingInvoiceCount === 1 ? '' : 's'} awaiting payment. Review your exams and settle your bills below.`
          : 'Here is an overview of your upcoming exams and billing history.'
      }
      actions={
        <Button variant="primary" size="lg" to="/invoices">
          <Icon name="credit-card" size={18} />
          View Invoices
        </Button>
      }
    />
  );
}