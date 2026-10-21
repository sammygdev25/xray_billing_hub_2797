import { useState, FormEvent } from 'react';
import { Button } from './ui';
import type { Patient, Exam } from '../types';

interface ExamFormData {
  patientId: number;
  examType: string;
  scheduledAt: string;
  price: number;
  status: string;
  studyNotes: string;
}

interface ExamFormProps {
  onSubmit: (data: ExamFormData) => void | Promise<void>;
  patients: Patient[];
  initialData?: Partial<Exam>;
}

const EXAM_TYPES = [
  'Chest X-ray',
  'Abdominal X-ray',
  'Skeletal X-ray',
  'Spine X-ray',
  'Extremity X-ray',
  'Dental X-ray',
];

const STATUS_OPTIONS = ['scheduled', 'completed', 'cancelled'];

function toLocalInputValue(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ExamForm({ onSubmit, patients, initialData }: ExamFormProps) {
  const [patientId, setPatientId] = useState<string>(
    initialData?.patientId ? String(initialData.patientId) : (patients[0] ? String(patients[0].id) : '')
  );
  const [examType, setExamType] = useState(initialData?.examType ?? EXAM_TYPES[0]);
  const [scheduledAt, setScheduledAt] = useState(toLocalInputValue(initialData?.scheduledAt));
  const [price, setPrice] = useState(initialData?.price != null ? String(initialData.price) : '');
  const [status, setStatus] = useState(initialData?.status ?? 'scheduled');
  const [studyNotes, setStudyNotes] = useState(initialData?.studyNotes ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!patientId) {
      setError('Select a patient.');
      return;
    }
    if (!examType.trim()) {
      setError('Exam type is required.');
      return;
    }
    if (!scheduledAt) {
      setError('Pick a date and time.');
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      setError('Enter a valid price.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        patientId: Number(patientId),
        examType: examType.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        price: priceValue,
        status,
        studyNotes,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <div className="ds-alert" role="alert">{error}</div>}

      <div className="ds-field">
        <label className="ds-label" htmlFor="exam-patient">Patient</label>
        <select
          id="exam-patient"
          className="input"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Select a patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.user?.fullName ?? `Patient #${p.id}`}
            </option>
          ))}
        </select>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="exam-type">Exam type</label>
          <select
            id="exam-type"
            className="input"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="exam-status">Status</label>
          <select
            id="exam-status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="exam-scheduled-at">Scheduled for</label>
          <input
            id="exam-scheduled-at"
            type="datetime-local"
            className="input"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="exam-price">Price (USD)</label>
          <input
            id="exam-price"
            type="number"
            min="0"
            step="0.01"
            className="input"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="exam-notes">Study notes</label>
        <textarea
          id="exam-notes"
          className="input"
          rows={4}
          placeholder="Clinical indication, preparation notes, or radiologist instructions"
          value={studyNotes}
          onChange={(e) => setStudyNotes(e.target.value)}
        />
        <div className="ds-help">Optional notes visible to the radiologist and staff.</div>
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : initialData?.id ? 'Update exam' : 'Schedule exam'}
        </Button>
      </div>
    </form>
  );
}

export default ExamForm;