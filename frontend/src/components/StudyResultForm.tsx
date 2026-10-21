import { useState, FormEvent } from 'react';
import { Button } from './ui';
import { Icon } from './icons';
import type { Exam } from '../types';

interface StudyResultFormProps {
  exam: Exam;
  onSave: (data: Partial<Exam>) => Promise<void> | void;
}

const STATUS_OPTIONS: { value: Exam['status']; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function StudyResultForm({ exam, onSave }: StudyResultFormProps) {
  const [studyNotes, setStudyNotes] = useState(exam.studyNotes ?? '');
  const [status, setStatus] = useState<Exam['status']>(exam.status);
  const [price, setPrice] = useState(String(exam.price ?? ''));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Enter a valid price.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        studyNotes,
        status,
        price: parsedPrice,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError('Could not save the study result. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      <div className="ds-field">
        <label className="ds-label" htmlFor="studyNotes">
          Radiology findings
        </label>
        <textarea
          id="studyNotes"
          className="input"
          rows={6}
          placeholder="Describe the X-ray study: positioning, findings, impression..."
          value={studyNotes}
          onChange={(e) => setStudyNotes(e.target.value)}
        />
        <p className="ds-help">Visible to billing and to the patient once the exam is marked completed.</p>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="status">
            Exam status
          </label>
          <select
            id="status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as Exam['status'])}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="price">
            Price (USD)
          </label>
          <input
            id="price"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="ds-small" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="ds-small" style={{ color: 'var(--color-success)' }}>
          Study result saved.
        </p>
      )}

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={saving}>
          <Icon name="check" size={16} />
          {saving ? 'Saving...' : 'Save study result'}
        </Button>
      </div>
    </form>
  );
}

export default StudyResultForm;
export { StudyResultForm };