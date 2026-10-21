import { Section, Grid, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Patient } from '../types';

interface PatientDetailFactsProps {
  patient: Patient;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Not provided';
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Not provided';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PatientDetailFacts({ patient }: PatientDetailFactsProps) {
  const fullName = patient.user?.fullName ?? 'Unknown patient';
  const email = patient.user?.email ?? 'Not provided';
  const role = patient.user?.role ?? 'patient';

  return (
    <Section eyebrow="Patient record" title="Details" tight>
      <Grid cols={2} size="md">
        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="user" size={18} />
            <span className="ds-label">Full name</span>
          </div>
          <p>{fullName}</p>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="mail" size={18} />
            <span className="ds-label">Email</span>
          </div>
          <p>{email}</p>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="shield" size={18} />
            <span className="ds-label">Account role</span>
          </div>
          <Badge tone={role === 'patient' ? 'primary' : 'soft'}>{role}</Badge>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="calendar" size={18} />
            <span className="ds-label">Date of birth</span>
          </div>
          <p>{formatDate(patient.dateOfBirth)}</p>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="phone" size={18} />
            <span className="ds-label">Phone</span>
          </div>
          <p>{patient.phone || 'Not provided'}</p>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="map-pin" size={18} />
            <span className="ds-label">Address</span>
          </div>
          <p>{patient.address || 'Not provided'}</p>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="clock" size={18} />
            <span className="ds-label">Registered on</span>
          </div>
          <p>{formatDate(patient.createdAt)}</p>
        </div>

        <div className="ds-card ds-card-body">
          <div className="ds-cluster">
            <Icon name="refresh" size={18} />
            <span className="ds-label">Last updated</span>
          </div>
          <p>{formatDate(patient.updatedAt)}</p>
        </div>
      </Grid>
    </Section>
  );
}