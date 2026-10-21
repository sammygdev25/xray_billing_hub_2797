import { useState } from 'react';
import type { Patient } from '../types';
import { EmptyState } from './ui';
import { Icon } from './icons';

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

function PatientList({ patients, onSelect }: PatientListProps) {
  const [query, setQuery] = useState('');

  const filtered = patients.filter((p) => {
    const name = p.user?.fullName?.toLowerCase() || '';
    const email = p.user?.email?.toLowerCase() || '';
    const q = query.toLowerCase();
    return name.includes(q) || email.includes(q) || p.phone?.toLowerCase().includes(q);
  });

  if (patients.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No patients yet"
        text="Patients registered at the lab will appear here for scheduling and billing."
      />
    );
  }

  return (
    <div className="ds-stack">
      <div className="ds-field">
        <label className="ds-label" htmlFor="patient-search">
          Search patients
        </label>
        <input
          id="patient-search"
          className="input"
          type="text"
          placeholder="Search by name, email or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="search" title="No matches" text="No patients match that search." />
      ) : (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of birth</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => onSelect(patient)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{patient.user?.fullName || 'Unknown'}</td>
                  <td>{patient.user?.email || '—'}</td>
                  <td>{patient.phone || '—'}</td>
                  <td>{patient.dateOfBirth || '—'}</td>
                  <td>
                    <Icon name="chevron-right" size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatientList;
export { PatientList };