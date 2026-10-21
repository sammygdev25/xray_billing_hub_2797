import type { Exam } from '../types';
import { Badge } from '../components/ui';

interface ExamTableProps {
  exams: Exam[];
  onRowClick?: (exam: Exam) => void;
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'scheduled':
      return 'primary';
    default:
      return 'neutral';
  }
}

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExamTable({ exams, onRowClick }: ExamTableProps) {
  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Exam Type</th>
            <th>Scheduled</th>
            <th>Radiologist</th>
            <th>Status</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr
              key={exam.id}
              onClick={() => onRowClick?.(exam)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <td>{exam.patient?.user?.fullName ?? `Patient #${exam.patientId}`}</td>
              <td>{exam.examType}</td>
              <td>{formatDateTime(exam.scheduledAt)}</td>
              <td>{exam.radiologist?.fullName ?? <span className="ds-muted">Unassigned</span>}</td>
              <td>
                <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
              </td>
              <td>${Number(exam.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExamTable;