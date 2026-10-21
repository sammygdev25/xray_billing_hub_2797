import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientDashboardActionsProps {
  onViewInvoices?: () => void;
  onViewExams?: () => void;
  onViewProfile?: () => void;
}

export default function PatientDashboardActions({
  onViewInvoices,
  onViewExams,
  onViewProfile,
}: PatientDashboardActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm">
        <Button to="/invoices" variant="primary" onClick={onViewInvoices}>
          <Icon name="credit-card" size={16} />
          View My Invoices
        </Button>
        <Button to="/dashboard" variant="secondary" onClick={onViewExams}>
          <Icon name="calendar" size={16} />
          Upcoming Exams
        </Button>
        <Button to="/profile" variant="secondary" onClick={onViewProfile}>
          <Icon name="user" size={16} />
          Update Profile
        </Button>
        <Button to="/invoices" variant="ghost">
          <Icon name="dollar" size={16} />
          Pay a Bill
        </Button>
      </Cluster>
    </Section>
  );
}