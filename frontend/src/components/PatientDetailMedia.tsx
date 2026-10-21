import { Section, Split, Media, CardMeta, Badge, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Patient } from '../types';

interface PatientDetailMediaProps {
  patient: Patient;
  onEdit?: () => void;
}

export default function PatientDetailMedia({ patient, onEdit }: PatientDetailMediaProps) {
  const name = patient.user?.fullName || 'Unnamed Patient';
  const email = patient.user?.email || '—';
  const phone = patient.phone || 'No phone on file';

  return (
    <Section tight>
      <Split>
        <Media alt={name} ratio="square" />
        <div className="ds-stack">
          <span className="ds-eyebrow">Patient Record</span>
          <h1 className="ds-card-title">{name}</h1>
          <CardMeta>{email}</CardMeta>
          <CardMeta>
            <Icon name="phone" size={16} /> {phone}
          </CardMeta>
          <Badge tone="soft">
            {patient.user?.role === 'patient' ? 'Active Patient' : 'Staff Record'}
          </Badge>
          <div className="ds-form-actions">
            <Button variant="primary" onClick={onEdit}>
              <Icon name="edit" size={16} /> Edit Patient
            </Button>
          </div>
        </div>
      </Split>
    </Section>
  );
}