import type { Patient } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge } from './ui';
import { Icon } from './icons';

interface PatientInfoCardProps {
  patient: Patient;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Not provided';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not provided';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function PatientInfoCard({ patient }: PatientInfoCardProps) {
  const name = patient.user?.fullName ?? 'Unknown patient';
  const email = patient.user?.email ?? 'No email on file';

  return (
    <Card>
      <CardBody>
        <div className="ds-between" style={{ alignItems: 'flex-start' }}>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardMeta>{email}</CardMeta>
          </div>
          <Badge tone="primary">Patient</Badge>
        </div>

        <div className="ds-stack" style={{ marginTop: 'var(--space-md, 1rem)' }}>
          <div className="ds-cluster">
            <Icon name="calendar" size={16} />
            <span className="ds-small ds-muted">Date of birth</span>
            <span>{formatDate(patient.dateOfBirth)}</span>
          </div>
          <div className="ds-cluster">
            <Icon name="phone" size={16} />
            <span className="ds-small ds-muted">Phone</span>
            <span>{patient.phone || 'Not provided'}</span>
          </div>
          <div className="ds-cluster">
            <Icon name="map-pin" size={16} />
            <span className="ds-small ds-muted">Address</span>
            <span>{patient.address || 'Not provided'}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export { PatientInfoCard };
export default PatientInfoCard;