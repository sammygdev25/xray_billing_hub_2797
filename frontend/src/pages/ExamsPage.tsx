import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExamList, getPatientList, createExam } from '../api';
import type { Exam, Patient } from '../types';
import ExamsHeader from '../components/ExamsHeader';
import ExamsContent from '../components/ExamsContent';

export default function ExamsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [examList, patientList] = await Promise.all([
        getExamList(),
        getPatientList(),
      ]);
      setExams(examList);
      setPatients(patientList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateExam = useCallback(
    async (data: any) => {
      await createExam(data);
      await loadData();
    },
    [loadData]
  );

  const handleRowClick = useCallback(
    (exam: Exam) => {
      navigate(`/exams/${exam.id}`);
    },
    [navigate]
  );

  return (
    <div className="ds-stack-lg">
      <ExamsHeader examCount={exams.length} />
      <ExamsContent
        exams={exams}
        patients={patients}
        loading={loading}
        onCreateExam={handleCreateExam}
        onRowClick={handleRowClick}
      />
    </div>
  );
}