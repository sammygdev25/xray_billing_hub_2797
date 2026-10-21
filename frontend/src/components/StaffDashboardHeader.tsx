import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface StaffDashboardHeaderProps {
  userName: string;
  role?: string;
  onNewExam?: () => void;
}

function roleLabel(role?: string): string {
  switch (role) {
    case 'receptionist':
      return 'Receptionist';
    case 'radiologist':
      return 'Radiologist';
    case 'billing':
      return 'Billing Specialist';
    default:
      return 'Staff';
  }
}

export default function StaffDashboardHeader({ userName, role, onNewExam }: StaffDashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow={roleLabel(role)}
      title={`Welcome back, ${userName}`}
      subtitle="Here's what's happening across patients, exams and invoices in the lab today."
      actions={
        onNewExam ? (
          <Button variant="primary" size="lg" onClick={onNewExam}>
            <Icon name="plus" size={18} />
            Schedule Exam
          </Button>
        ) : undefined
      }
    />
  );
}