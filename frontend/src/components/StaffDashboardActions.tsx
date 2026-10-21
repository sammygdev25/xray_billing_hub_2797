import { Section, Cluster, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardActionsProps {
  onNewExam?: () => void;
}

export default function StaffDashboardActions({ onNewExam }: StaffDashboardActionsProps) {
  return (
    <Section title="Quick actions" tight>
      <Cluster gap="sm" wrap>
        <Button variant="primary" to="/staff/patients">
          <Icon name="users" size={16} /> View patients
        </Button>
        <Button variant="secondary" to="/staff/exams">
          <Icon name="calendar" size={16} /> Exam queue
        </Button>
        <Button variant="secondary" to="/invoices">
          <Icon name="credit-card" size={16} /> Invoices
        </Button>
        {onNewExam && (
          <Button variant="ghost" onClick={onNewExam}>
            <Icon name="plus" size={16} /> Schedule exam
          </Button>
        )}
        <Button variant="ghost" to="/profile">
          <Icon name="settings" size={16} /> Account settings
        </Button>
      </Cluster>
    </Section>
  );
}