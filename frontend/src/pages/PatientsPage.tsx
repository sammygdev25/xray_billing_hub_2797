import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientList, createPatient } from '../api';
import type { Patient } from '../types';
import PatientsHeader from '../components/PatientsHeader';
import PatientsContent from '../components/PatientsContent';
import PatientForm from '../components/PatientForm';
import { Alert } from '../components/ui';

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPatientList();
      setPatients(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to load patients right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleRowClick = (patient: Patient) => {
    navigate(`/staff/patients/${patient.id}`);
  };

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await createPatient(data);
      setShowForm(false);
      await loadPatients();
    } catch (err) {
      console.error(err);
      setError('Could not register the patient. Check the details and try again.');
    }
  };

  return (
    <div className="ds-stack-lg">
      <PatientsHeader patientCount={patients.length} onAddPatient={handleAddClick} />
      {error && <Alert tone="danger">{error}</Alert>}
      {showForm && (
        <div className="ds-card ds-card-body">
          <h3 className="ds-card-title">Register New Patient</h3>
          <PatientForm onSubmit={handleSubmit} />
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}
      <PatientsContent
        patients={patients}
        loading={loading}
        onRowClick={handleRowClick}
        onAddClick={handleAddClick}
      />
    </div>
  );
}