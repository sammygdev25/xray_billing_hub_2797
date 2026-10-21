import type { Patient } from '../types';
import { Section, Card, CardBody, EmptyState, SkeletonCards, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PatientsContentProps {
  patients: Patient[];
  loading: boolean;
  onRowClick: (patient: Patient) => void;
  onAddClick: () => void;
}

export default function PatientsContent({ patients, loading, onRowClick, onAddClick }: PatientsContentProps) {
  if (loading) {
    return (
      <Section title="Registered patients" subtitle="Everyone on file for this lab">
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (!patients.length) {
    return (
      <Section title="Registered patients" subtitle="Everyone on file for this lab">
        <EmptyState
          icon="users"
          title="No patients yet"
          text="Register a patient to start scheduling X-ray exams and issuing invoices."
          action={<Button variant="primary" onClick={onAddClick}>Register patient</Button>}
        />
      </Section>
    );
  }

  return (
    <Section title="Registered patients" subtitle={`${patients.length} patient${patients.length === 1 ? '' : 's'} on file`}>
      <Card>
        <CardBody>
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of birth</th>
                  <th>Address</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} onClick={() => onRowClick(patient)}>
                    <td>{patient.user?.fullName ?? 'Unnamed patient'}</td>
                    <td>{patient.user?.email ?? '—'}</td>
                    <td>{patient.phone || '—'}</td>
                    <td>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '—'}</td>
                    <td className="ds-muted">{patient.address || '—'}</td>
                    <td>
                      <Icon name="chevron-right" size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Section>
  );
}