import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState, Icon, Stack } from './ui';
import type { Exam } from '../types';

interface ExamQueueListProps {
  exams: Exam[];
}

function formatScheduledAt(value: string): string {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function statusTone(status: string): 'neutral' | 'primary' | 'success' | 'danger' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'primary';
}

function ExamQueueList({ exams }: ExamQueueListProps) {
  const queue = exams
    .filter((exam) => exam.status === 'scheduled')
    .slice()
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  if (queue.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No exams in queue"
        text="Scheduled X-ray exams waiting to be performed will appear here."
      />
    );
  }

  return (
    <Stack gap="sm">
      {queue.map((exam) => (
        <Card key={exam.id} className="ds-card-body">
          <Link to={`/exams/${exam.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <CardBody>
              <div className="ds-between">
                <div>
                  <CardTitle>{exam.examType}</CardTitle>
                  <CardMeta>
                    <Icon name="user" size={14} /> {exam.patient?.user?.fullName ?? 'Unknown patient'}
                  </CardMeta>
                </div>
                <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
              </div>
              <div className="ds-cluster" style={{ marginTop: '0.5rem' }}>
                <span className="ds-small ds-muted">
                  <Icon name="clock" size={14} /> {formatScheduledAt(exam.scheduledAt)}
                </span>
                <span className="ds-small ds-muted">
                  <Icon name="dollar" size={14} /> {Number(exam.price).toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Link>
        </Card>
      ))}
    </Stack>
  );
}

export default ExamQueueList;
export { ExamQueueList };