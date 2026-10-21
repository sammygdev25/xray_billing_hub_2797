import type { Patient } from '../types';
import { Icon } from './icons';
import { EmptyState } from './ui';

interface PatientTableProps {
  patients: Patient[];
  onRowClick: (patient: Patient) => void;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function PatientTable({ patients, onRowClick }: PatientTableProps) {
  if (!patients || patients.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No patients found"
        text="Register a new patient to start tracking X-ray exams and invoices."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of birth</th>
            <th>Registered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              onClick={() => onRowClick(patient)}
              style={{ cursor: 'pointer' }}
            >
              <td>{patient.user?.fullName ?? '—'}</td>
              <td>{patient.user?.email ?? '—'}</td>
              <td>{patient.phone || '—'}</td>
              <td>{formatDate(patient.dateOfBirth)}</td>
              <td>{formatDate(patient.createdAt)}</td>
              <td>
                <Icon name="chevron-right" size={16} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientTable;