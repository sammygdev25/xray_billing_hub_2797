import type { Exam } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Badge, Stack, Price } from '../components/ui';
import { Icon } from '../components/icons';

interface ExamInfoCardProps {
  exam: Exam;
}

const STATUS_TONE: Record<string, 'neutral' | 'primary' | 'soft' | 'success' | 'danger'> = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'danger',
};

function formatDateTime(value?: string | null): string {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ExamInfoCard({ exam }: ExamInfoCardProps) {
  const tone = STATUS_TONE[exam.status] ?? 'neutral';

  return (
    <Card>
      <CardBody>
        <Stack gap="sm">
          <Stack justify="between" align="center" gap="sm">
            <CardTitle>{exam.examType}</CardTitle>
            <Badge tone={tone}>{exam.status}</Badge>
          </Stack>

          <CardMeta>
            <Icon name="calendar" size={16} />
            {formatDateTime(exam.scheduledAt)}
          </CardMeta>

          {exam.patient?.user?.fullName && (
            <CardMeta>
              <Icon name="user" size={16} />
              {exam.patient.user.fullName}
            </CardMeta>
          )}

          {exam.radiologist?.fullName && (
            <CardMeta>
              <Icon name="users" size={16} />
              Radiologist: {exam.radiologist.fullName}
            </CardMeta>
          )}

          {exam.scheduledBy?.fullName && (
            <CardMeta>
              <Icon name="edit" size={16} />
              Scheduled by {exam.scheduledBy.fullName}
            </CardMeta>
          )}

          {exam.studyNotes && (
            <p className="ds-muted ds-small">{exam.studyNotes}</p>
          )}

          <Price value={exam.price} />
        </Stack>
      </CardBody>
    </Card>
  );
}

export default ExamInfoCard;