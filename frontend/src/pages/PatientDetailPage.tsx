import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPatient, getPatientList, getExamList, getInvoiceList } from '../api';
import type { Patient, Exam, Invoice } from '../types';
import { SkeletonCards, LoadingBlock, Alert, EmptyState } from '../components/ui';
import PatientDetailMedia from '../components/PatientDetailMedia';
import PatientDetailFacts from '../components/PatientDetailFacts';
import PatientDetailRelated from '../components/PatientDetailRelated';
import ExamHistoryList from '../components/ExamHistoryList';
import InvoiceHistoryList from '../components/InvoiceHistoryList';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [relatedPatients, setRelatedPatients] = useState<Patient[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!patientId || Number.isNaN(patientId)) {
      setError('Invalid patient id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [patientData, allPatients, allExams, allInvoices] = await Promise.all([
        getPatient(patientId),
        getPatientList(),
        getExamList(),
        getInvoiceList(),
      ]);

      setPatient(patientData);
      setRelatedPatients(
        allPatients.filter((p) => p.id !== patientId)
      );
      setExams(allExams.filter((e) => e.patientId === patientId));

      const patientUserId = patientData.userId ?? patientData.user?.id;
      setInvoices(
        allInvoices.filter((inv) => inv.userId === patientUserId)
      );
    } catch (err) {
      console.error(err);
      setError('Failed to load patient record.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="ds-container ds-stack-lg">
        <LoadingBlock label="Loading patient record..." />
        <SkeletonCards count={3} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="ds-container ds-stack-lg">
        <Alert tone="danger">{error ?? 'Patient not found.'}</Alert>
        <EmptyState
          icon="users"
          title="Patient not found"
          text="This patient record could not be loaded. It may have been removed."
        />
      </div>
    );
  }

  return (
    <div className="ds-stack-lg">
      <PatientDetailMedia patient={patient} />

      <PatientDetailFacts patient={patient} />

      <ExamHistoryList exams={exams} />

      <InvoiceHistoryList invoices={invoices} />

      <PatientDetailRelated patients={relatedPatients} currentPatientId={patientId} />
    </div>
  );
}