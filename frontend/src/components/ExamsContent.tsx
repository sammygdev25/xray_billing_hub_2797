import { useState } from 'react';
import type { Exam, Patient } from '../types';
import { Section, Button, EmptyState, SkeletonCards } from '../components/ui';
import { Icon } from '../components/icons';
import ExamForm from './ExamForm';
import ExamTable from './ExamTable';

interface ExamsContentProps {
  exams: Exam[];
  patients: Patient[];
  loading: boolean;
  onCreateExam: (data: any) => Promise<void> | void;
  onRowClick: (exam: Exam) => void;
}

export default function ExamsContent({ exams, patients, loading, onCreateExam, onRowClick }: ExamsContentProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: any) => {
    await onCreateExam(data);
    setShowForm(false);
  };

  return (
    <Section
      eyebrow="Radiology scheduling"
      title="All exams"
      subtitle="Review scheduled, completed and cancelled X-ray studies across the lab."
      actions={
        <Button variant={showForm ? 'ghost' : 'primary'} onClick={() => setShowForm((v) => !v)}>
          <Icon name={showForm ? 'close' : 'plus'} size={16} />
          {showForm ? 'Cancel' : 'Schedule exam'}
        </Button>
      }
    >
      {showForm && (
        <div className="ds-card ds-card-body" style={{ marginBottom: '1.5rem' }}>
          <ExamForm onSubmit={handleSubmit} patients={patients} initialData={{}} />
        </div>
      )}

      {loading ? (
        <SkeletonCards count={6} />
      ) : exams.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No exams scheduled yet"
          text="Schedule the first X-ray exam for a patient to see it listed here."
          action={
            !showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Icon name="plus" size={16} />
                Schedule exam
              </Button>
            )
          }
        />
      ) : (
        <ExamTable exams={exams} onRowClick={onRowClick} />
      )}
    </Section>
  );
}