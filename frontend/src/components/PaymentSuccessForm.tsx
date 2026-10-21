import { Section, WithSidebar, Alert, Button } from '../components/ui';
import { Icon } from '../components/icons';

interface PaymentSuccessFormProps {
  invoiceId?: string | number;
  patientName?: string;
  examType?: string;
  error?: string | null;
  onViewInvoice?: () => void;
  onBackToInvoices?: () => void;
}

export default function PaymentSuccessForm({
  invoiceId,
  patientName,
  examType,
  error,
  onViewInvoice,
  onBackToInvoices,
}: PaymentSuccessFormProps) {
  return (
    <Section
      eyebrow="Payment confirmation"
      title="Your payment was received"
      subtitle="Thank you for settling your X-ray lab invoice. A confirmation has been recorded on your account."
    >
      <WithSidebar
        sidebar={
          <div className="ds-card ds-card-body ds-stack" style={{ gap: 'var(--space-sm, 0.75rem)' }}>
            <div className="ds-cluster">
              <Icon name="shield" />
              <strong>Secure checkout</strong>
            </div>
            <p className="ds-muted ds-small">
              Your card details are processed by Stripe and never stored on our servers. A receipt
              will also be emailed to the address on file.
            </p>
            <div className="ds-cluster">
              <Icon name="phone" />
              <span className="ds-small">Questions about this charge? Contact billing.</span>
            </div>
          </div>
        }
      >
        {error ? (
          <Alert tone="danger">{error}</Alert>
        ) : (
          <Alert tone="success">
            Payment confirmed{invoiceId ? ` for invoice #${invoiceId}` : ''}. Your billing status has
            been updated to Paid.
          </Alert>
        )}

        <div className="ds-form">
          <div className="ds-field">
            <span className="ds-label">Patient</span>
            <div>{patientName || 'On file with this account'}</div>
          </div>

          <div className="ds-field">
            <span className="ds-label">Exam</span>
            <div>{examType || 'X-ray exam'}</div>
          </div>

          <div className="ds-field">
            <span className="ds-label">Invoice reference</span>
            <div>{invoiceId ? `#${invoiceId}` : 'Pending'}</div>
          </div>

          <p className="ds-help">
            You can review the full billing breakdown, including itemized exam charges, on the invoice
            detail page at any time from your invoice history.
          </p>

          <div className="ds-form-actions">
            <Button variant="primary" onClick={onViewInvoice}>
              <Icon name="package" /> View invoice
            </Button>
            <Button variant="ghost" onClick={onBackToInvoices}>
              Back to invoices
            </Button>
          </div>
        </div>
      </WithSidebar>
    </Section>
  );
}