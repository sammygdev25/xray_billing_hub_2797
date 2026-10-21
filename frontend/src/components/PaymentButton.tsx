import { useState } from 'react';
import { api } from '../api';

interface PaymentButtonProps {
  invoiceId: string;
  amount: number;
}

export function PaymentButton({ invoiceId, amount }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/payments/create-checkout-session/', { invoiceId });
      const checkoutUrl = res.data?.url || res.data?.checkoutUrl || res.data?.sessionUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('Unable to start payment. Please try again.');
      }
    } catch (err) {
      console.error('[PaymentButton] Error:', err);
      setError('Unable to start payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ds-stack" style={{ gap: 'var(--space-sm, 8px)' }}>
      <button
        type="button"
        className="btn btn-primary ds-btn-lg"
        onClick={handlePay}
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Redirecting to payment...' : `Pay $${amount.toFixed(2)}`}
      </button>
      {error && (
        <p className="ds-small" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default PaymentButton;