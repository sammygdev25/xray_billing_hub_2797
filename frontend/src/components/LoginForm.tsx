import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Alert } from './ui';

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('[LoginForm] Login failed:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="ds-field">
        <label className="ds-label" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@radview-lab.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="ds-field">
        <label className="ds-label" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="ds-form-actions">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
export { LoginForm };