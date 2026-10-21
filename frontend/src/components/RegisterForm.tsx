import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Alert } from './ui';

interface RegisterFormProps {
  onSuccess: () => void;
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        role: 'patient',
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Registration failed. That email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <Alert tone="danger">{error}</Alert>}

      <div className="ds-field">
        <label className="ds-label" htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          className="input"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Carter"
          autoComplete="name"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="ds-field">
        <label className="ds-label" htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          className="input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />
      </div>

      <p className="ds-help">
        This creates a patient account for viewing exam results and paying invoices. Lab staff accounts are
        created by the billing office.
      </p>

      <div className="ds-form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;