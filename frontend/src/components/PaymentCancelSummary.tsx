import { Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Media, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice } from '../types';

interface PaymentCancelSummaryProps {
  invoice: Invoice | null;
  onRetry?: () => void;
}

export default function PaymentCancelSummary({ invoice, onRetry }: PaymentCancelSummaryProps) {
  if (!invoice) {
    return (
      <Card>
        <CardBody>
          <CardTitle>Order summary</CardTitle>
          <p className="ds-muted">No invoice found for this payment attempt.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <CardTitle>Order summary</CardTitle>
        <div className="ds-cluster" style={{ marginTop: '0.75rem' }}>
          <Media
            src=""
            alt={invoice.exam?.examType || 'X-ray exam'}
            ratio="square"
            badge="Unpaid"
          />
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              {invoice.exam?.examType || 'X-ray exam'}
            </p>
            <CardMeta>Invoice #{invoice.id}</CardMeta>
          </div>
        </div>

        <div className="ds-between" style={{ marginTop: '1rem' }}>
          <span className="ds-muted">Total due</span>
          <Price value={invoice.totalAmount} />
        </div>

        <div className="ds-between" style={{ marginTop: '0.5rem' }}>
          <span className="ds-muted">Status</span>
          <span style={{ color: 'var(--color-danger)' }}>
            <Icon name="alert" size={16} /> Payment cancelled
          </span>
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="primary" size="lg" onClick={onRetry} style={{ width: '100%' }}>
          <Icon name="credit-card" size={16} /> Try payment again
        </Button>
      </CardFooter>
    </Card>
  );
}