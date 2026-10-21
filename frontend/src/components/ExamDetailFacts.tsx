import { Section, Grid, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface ExamDetailFactsProps {
  exam: Exam;
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

function formatDateTime(value?: string | null): string {
  if (!value) return 'Not set';
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

export default function ExamDetailFacts({ exam }: ExamDetailFactsProps) {
  const price = typeof exam.price === 'number' ? exam.price : parseFloat(String(exam.price ?? 0));

  return (
    <Section eyebrow="Exam record" title="Exam details" tight>
      <Grid cols={2} size="sm">
        <div className="ds-field">
          <span className="ds-label">
            <Icon name="tag" size={14} /> Exam type
          </span>
          <div>{exam.examType}</div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="info" size={14} /> Status
          </span>
          <div>
            <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
          </div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="calendar" size={14} /> Scheduled for
          </span>
          <div>{formatDateTime(exam.scheduledAt)}</div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="dollar" size={14} /> Price
          </span>
          <div className="ds-price">${Number(price || 0).toFixed(2)}</div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="user" size={14} /> Scheduled by
          </span>
          <div>{exam.scheduledBy?.fullName ?? 'Unassigned'}</div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="users" size={14} /> Radiologist
          </span>
          <div>{exam.radiologist?.fullName ?? 'Not yet assigned'}</div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="clock" size={14} /> Recorded on
          </span>
          <div>{formatDateTime(exam.createdAt)}</div>
        </div>

        <div className="ds-field">
          <span className="ds-label">
            <Icon name="refresh" size={14} /> Last updated
          </span>
          <div>{formatDateTime(exam.updatedAt)}</div>
        </div>
      </Grid>

      <div className="ds-field">
        <span className="ds-label">
          <Icon name="edit" size={14} /> Study notes
        </span>
        <div className="ds-muted">
          {exam.studyNotes && exam.studyNotes.trim().length > 0
            ? exam.studyNotes
            : 'No radiology notes have been recorded for this study yet.'}
        </div>
      </div>
    </Section>
  );
}