import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPatientList, getExamList, getInvoiceList } from '../api';
import type { Exam, Invoice } from '../types';
import { LoadingBlock, Alert } from '../components/ui';
import StaffDashboardHeader from '../components/StaffDashboardHeader';
import StaffDashboardStats from '../components/StaffDashboardStats';
import StaffDashboardRecent from '../components/StaffDashboardRecent';
import StaffDashboardActions from '../components/StaffDashboardActions';

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [scheduledExams, setScheduledExams] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [revenueCollected, setRevenueCollected] = useState(0);
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [patients, exams, invoices] = await Promise.all([
        getPatientList(),
        getExamList(),
        getInvoiceList(),
      ]);

      setTotalPatients(patients.length);
      setScheduledExams(exams.filter((e) => e.status === 'scheduled').length);
      setPendingInvoices(invoices.filter((i) => i.status === 'pending').length);
      setRevenueCollected(
        invoices
          .filter((i) => i.status === 'paid')
          .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0)
      );

      const sortedExams = [...exams].sort(
        (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      );
      setRecentExams(sortedExams.slice(0, 5));

      const sortedInvoices = [...invoices].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentInvoices(sortedInvoices.slice(0, 5));
    } catch (err) {
      console.error(err);
      setError('Dashboard data will appear here as records are added.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewExam = () => {
    navigate('/staff/exams');
  };

  if (loading) {
    return <LoadingBlock label="Loading dashboard..." />;
  }

  return (
    <div className="ds-stack-lg">
      <StaffDashboardHeader
        userName={user?.full_name || 'Staff'}
        role={user?.role}
        onNewExam={handleNewExam}
      />
      {error && <Alert tone="danger">{error}</Alert>}
      <StaffDashboardStats
        totalPatients={totalPatients}
        scheduledExams={scheduledExams}
        pendingInvoices={pendingInvoices}
        revenueCollected={revenueCollected}
      />
      <StaffDashboardRecent recentExams={recentExams} recentInvoices={recentInvoices} />
      <StaffDashboardActions onNewExam={handleNewExam} />
    </div>
  );
}