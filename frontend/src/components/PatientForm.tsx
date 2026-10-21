import { useState, FormEvent } from 'react';
import { Button } from './ui';

export interface PatientFormData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  address: string;
}

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void | Promise<void>;
  initialData?: Partial<PatientFormData>;
}

function PatientForm({ onSubmit, initialData }: PatientFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initialData);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim(),
        dateOfBirth,
        phone: phone.trim(),
        address: address.trim(),
      });
    } catch (err) {
      console.error('[PatientForm] Submit failed:', err);
      setError('Could not save patient record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && (
        <div className="ds-alert" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          {error}
        </div>
      )}

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="patient-full-name">Full name</label>
          <input
            id="patient-full-name"
            className="input"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="patient-email">Email</label>
          <input
            id="patient-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane.doe@example.com"
            disabled={isEdit}
            required
          />
          {isEdit && <span className="ds-help">Email cannot be changed once registered.</span>}
        </div>
      </div>

      <div className="ds-form-row">
        <div className="ds-field">
          <label className="ds-label" htmlFor="patient-dob">Date of birth</label>
          <input
            id="patient-dob"
            className="input"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div className="ds-field">
          <label className="ds-label" htmlFor="patient-phone">Phone</label>
          <input
            id="patient-phone"
            className="input"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="patient-address">Address</label>
        <textarea
          id="patient-address"
          className="input"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, city, state, ZIP"
        />
      </div>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Register patient'}
        </Button>
      </div>
    </form>
  );
}

export default PatientForm;
export { PatientForm };