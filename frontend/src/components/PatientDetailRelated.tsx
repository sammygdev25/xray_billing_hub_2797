import { Link } from 'react-router-dom';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Patient } from '../types';

interface PatientDetailRelatedProps {
  patients: Patient[];
  currentPatientId?: number;
}

export default function PatientDetailRelated({ patients, currentPatientId }: PatientDetailRelatedProps) {
  const related = patients
    .filter((p) => p.id !== currentPatientId)
    .slice(0, 6);

  if (related.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Lab records"
      title="Other patients"
      subtitle="Additional patients on file at the lab, for quick cross-reference."
    >
      <Grid size="sm">
        {related.map((patient) => (
          <Card key={patient.id} to={`/staff/patients/${patient.id}`}>
            <CardBody>
              <CardTitle>
                <Icon name="user" size={16} /> {patient.user?.fullName ?? 'Patient'}
              </CardTitle>
              <CardMeta>{patient.user?.email ?? 'No email on file'}</CardMeta>
              <CardMeta>{patient.phone ? patient.phone : 'No phone on file'}</CardMeta>
              <Badge tone="neutral">
                {patient.dateOfBirth ? `DOB ${patient.dateOfBirth}` : 'DOB not recorded'}
              </Badge>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}