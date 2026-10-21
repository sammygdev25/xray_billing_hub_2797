import type { Exam } from '../types';
import { Link } from 'react-router-dom';
import { Badge, EmptyState, Price } from '../components/ui';
import { Icon } from '../components/icons';

interface ExamHistoryListProps {
  exams: Exam[];
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

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ExamHistoryList({ exams }: ExamHistoryListProps) {
  if (!exams || exams.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No exam history yet"
        text="Past X-ray studies will show up here once exams are completed."
      />
    );
  }

  const sorted = [...exams].sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Exam type</th>
            <th>Status</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((exam) => (
            <tr key={exam.id}>
              <td>{formatDate(exam.scheduledAt)}</td>
              <td>{exam.examType}</td>
              <td>
                <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
              </td>
              <td>
                <Price value={exam.price} />
              </td>
              <td>
                <Link to={`/exams/${exam.id}`} className="ds-cluster" aria-label={`View ${exam.examType} exam`}>
                  <Icon name="chevron-right" size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExamHistoryList;
export { ExamHistoryList };