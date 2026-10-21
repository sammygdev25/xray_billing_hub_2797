import { PageHeader, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface ExamsHeaderProps {
  onNewExam?: () => void;
  examCount?: number;
}

export default function ExamsHeader({ onNewExam, examCount }: ExamsHeaderProps) {
  return (
    <PageHeader
      eyebrow="X-ray Lab"
      title="Exams"
      subtitle={
        typeof examCount === 'number'
          ? `${examCount} exam${examCount === 1 ? '' : 's'} scheduled, in progress or completed`
          : 'Schedule studies, track status and record radiology findings'
      }
      actions={
        onNewExam ? (
          <Button variant="primary" onClick={onNewExam}>
            <Icon name="plus" size={18} />
            Schedule exam
          </Button>
        ) : undefined
      }
    />
  );
}