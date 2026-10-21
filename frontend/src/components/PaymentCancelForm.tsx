import { Section, WithSidebar, Alert, Button, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice } from '../types';

interface PaymentCancelFormProps {
  invoice?: Invoice | null;
  error?: string | null;
  onRetry: () => void;
}

export default function PaymentCancelForm({ invoice, error, onRetry }: PaymentCancelFormProps) {
  return (
    <Section
      eyebrow="Billing"
      title="Payment was not completed"
      subtitle="Your card was not charged. You can retry the payment or reach out to our billing team for help."
    >
      <WithSidebar
        sidebar={
          <Stack gap="sm">
            <h3 className="ds-card-title">Need help?</h3>
            <p className="ds-muted ds-small">
              If you keep running into trouble paying this invoice, contact our billing
              department and we'll sort it out or arrange another payment method.
            </p>
            <Stack gap="xs">
              <span className="ds-cluster ds-small">
                <Icon name="mail" size={16} /> billing@xraylab.example
              </span>
              <span className="ds-cluster ds-small">
                <Icon name="phone" size={16} /> (555) 010-2024
              </span>
            </Stack>
          </Stack>
        }
      >
        <div className="ds-form">
          <Alert tone="danger">
            <Icon name="alert" size={16} />
            {error || 'Your Stripe checkout session was cancelled before payment finished.'}
          </Alert>

          {invoice && (
            <div className="ds-field">
              <span className="ds-label">Invoice reference</span>
              <p className="ds-muted">
                Invoice #{invoice.id} for {invoice.exam?.examType || 'your exam'} remains{' '}
                <strong>pending</strong>. No charge has been made to your card.
              </p>
            </div>
          )}

          <div className="ds-form-actions">
            <Button variant="primary" onClick={onRetry}>
              <Icon name="credit-card" size={16} /> Try payment again
            </Button>
            <Button variant="ghost" to="/invoices">
              <Icon name="arrow-left" size={16} /> Back to invoices
            </Button>
          </div>
        </div>
      </WithSidebar>
    </Section>
  );
}