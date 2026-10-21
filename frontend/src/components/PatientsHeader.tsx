import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientsHeaderProps {
  patientCount?: number;
  onAddPatient?: () => void;
}

export default function PatientsHeader({ patientCount, onAddPatient }: PatientsHeaderProps) {
  return (
    <PageHeader
      eyebrow="Patient Records"
      title="Patients"
      subtitle={
        typeof patientCount === 'number'
          ? `${patientCount} registered patient${patientCount === 1 ? '' : 's'} in the X-ray lab system`
          : 'Register new patients and manage existing records for the X-ray lab'
      }
      actions={
        onAddPatient && (
          <Button variant="primary" onClick={onAddPatient}>
            <Icon name="plus" size={16} />
            Add Patient
          </Button>
        )
      }
    />
  );
}