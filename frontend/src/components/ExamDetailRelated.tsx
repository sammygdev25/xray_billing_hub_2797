import { Link } from 'react-router-dom';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import type { Exam } from '../types';

interface ExamDetailRelatedProps {
  exams: Exam[];
  currentExamId?: number;
}

function statusTone(status: string): 'neutral' | 'success' | 'danger' {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

export default function ExamDetailRelated({ exams, currentExamId }: ExamDetailRelatedProps) {
  const related = exams
    .filter((exam) => exam.id !== currentExamId)
    .slice(0, 6);

  if (related.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Patient history"
      title="Other exams for this patient"
      subtitle="Past and upcoming studies scheduled for the same patient at this lab."
    >
      <Grid size="sm">
        {related.map((exam) => (
          <Card key={exam.id} to={`/exams/${exam.id}`}>
            <CardBody>
              <CardTitle>{exam.examType}</CardTitle>
              <CardMeta>
                <Icon name="calendar" size={14} />
                {new Date(exam.scheduledAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </CardMeta>
              <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
            </CardBody>
          </Card>
        ))}
      </Grid>
      <div className="ds-cluster" style={{ marginTop: 'var(--space-md, 1rem)' }}>
        <Link to="/invoices" className="ds-small">
          View billing for these exams
        </Link>
      </div>
    </Section>
  );
}