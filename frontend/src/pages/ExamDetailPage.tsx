import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam, getExamList, updateExam } from '../api';
import type { Exam } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ExamInfoCard } from '../components/ExamInfoCard';
import { StudyResultForm } from '../components/StudyResultForm';
import ExamDetailMedia from '../components/ExamDetailMedia';
import ExamDetailFacts from '../components/ExamDetailFacts';
import ExamDetailRelated from '../components/ExamDetailRelated';
import { Alert, LoadingBlock, EmptyState, Button } from '../components/ui';

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [relatedExams, setRelatedExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const examId = id ? parseInt(id, 10) : NaN;

  const loadExam = useCallback(async () => {
    if (!examId || Number.isNaN(examId)) {
      setError('Invalid exam id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getExam(examId);
      setExam(data);

      const all = await getExamList();
      const related = all.filter(
        (e) => e.patientId === data.patientId && e.id !== data.id
      );
      setRelatedExams(related);
    } catch (err) {
      console.error(err);
      setError('Could not load this exam. It may have been removed.');
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  const handleStatusChange = async (status: string) => {
    if (!exam) return;
    setActionError(null);
    try {
      const updated = await updateExam(exam.id, { status });
      setExam(updated);
    } catch (err) {
      console.error(err);
      setActionError('Could not update the exam status. Please try again.');
    }
  };

  const handleSaveResults = async (data: Partial<Exam>) => {
    if (!exam) return;
    setActionError(null);
    try {
      const updated = await updateExam(exam.id, data);
      setExam(updated);
    } catch (err) {
      console.error(err);
      setActionError('Could not save the study results. Please try again.');
      throw err;
    }
  };

  if (loading) {
    return <LoadingBlock label="Loading exam..." />;
  }

  if (error || !exam) {
    return (
      <EmptyState
        icon="alert"
        title="Exam not found"
        text={error ?? 'This exam could not be found.'}
        action={<Button onClick={() => navigate('/staff/exams')}>Back to exams</Button>}
      />
    );
  }

  const canRecordResults = !!user && user.role !== 'patient';

  return (
    <div className="ds-stack-lg">
      {actionError && <Alert tone="danger">{actionError}</Alert>}

      <ExamDetailMedia
        exam={exam}
        onMarkCompleted={() => handleStatusChange('completed')}
        onCancel={() => handleStatusChange('cancelled')}
      />

      <ExamDetailFacts exam={exam} />

      {canRecordResults && (
        <ExamInfoCard exam={exam} />
      )}

      {canRecordResults && (
        <StudyResultForm exam={exam} onSave={handleSaveResults} />
      )}

      {relatedExams.length > 0 && (
        <ExamDetailRelated exams={relatedExams} currentExamId={exam.id} />
      )}
    </div>
  );
}
