import { Section, Split, Media, Badge, Price, Button, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface ExamDetailMediaProps {
  exam: Exam;
  onMarkCompleted?: () => void;
  onCancel?: () => void;
}

function statusTone(status: string): 'primary' | 'success' | 'danger' | 'neutral' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'scheduled') return 'primary';
  return 'neutral';
}

export default function ExamDetailMedia({ exam, onMarkCompleted, onCancel }: ExamDetailMediaProps) {
  const scheduledDate = new Date(exam.scheduledAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <Section tight>
      <Split>
        <Media alt={exam.examType} ratio="wide" badge={exam.status} />
        <div className="ds-stack">
          <span className="ds-eyebrow">X-Ray Exam</span>
          <h1 className="ds-card-title">{exam.examType}</h1>
          <CardMeta>
            <Icon name="calendar" size={16} /> Scheduled for {scheduledDate}
          </CardMeta>
          <div className="ds-cluster">
            <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
          </div>
          <Price value={exam.price} />
          <div className="ds-form-actions">
            {exam.status === 'scheduled' && onMarkCompleted && (
              <Button variant="primary" onClick={onMarkCompleted}>
                <Icon name="check" size={16} /> Mark as Completed
              </Button>
            )}
            {exam.status === 'scheduled' && onCancel && (
              <Button variant="danger" onClick={onCancel}>
                <Icon name="close" size={16} /> Cancel Exam
              </Button>
            )}
          </div>
        </div>
      </Split>
    </Section>
  );
}