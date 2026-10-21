import { Link } from 'react-router-dom';
import type { Exam } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge, EmptyState, Stack } from '../components/ui';
import { Icon } from '../components/icons';

interface UpcomingExamsListProps {
  exams: Exam[];
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function UpcomingExamsList({ exams }: UpcomingExamsListProps) {
  const upcoming = exams
    .filter((exam) => exam.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  if (upcoming.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No upcoming exams"
        text="There are no X-ray exams scheduled at the moment."
      />
    );
  }

  return (
    <Stack gap="sm">
      {upcoming.map((exam) => (
        <Card key={exam.id} to={`/exams/${exam.id}`}>
          <CardBody>
            <Stack gap="xs">
              <div className="ds-between">
                <CardTitle>{exam.examType}</CardTitle>
                <Badge tone="primary">Scheduled</Badge>
              </div>
              <CardMeta>
                <Icon name="calendar" size={14} /> {formatDateTime(exam.scheduledAt)}
              </CardMeta>
              {exam.patient?.user?.fullName && (
                <CardMeta>
                  <Icon name="user" size={14} /> {exam.patient.user?.fullName}
                </CardMeta>
              )}
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}

export default UpcomingExamsList;
export { UpcomingExamsList };