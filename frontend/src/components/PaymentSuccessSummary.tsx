import { Card, CardBody, CardTitle, CardFooter, Price, Media, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice, Exam } from '../types';

interface PaymentSuccessSummaryProps {
  invoice: Invoice | null;
  exam?: Exam | null;
  onViewInvoices?: () => void;
}

export default function PaymentSuccessSummary({ invoice, exam, onViewInvoices }: PaymentSuccessSummaryProps) {
  if (!invoice) {
    return (
      <Card>
        <CardBody>
          <CardTitle>Order summary</CardTitle>
          <p className="ds-muted">No invoice details to display.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <CardTitle>Payment summary</CardTitle>
        <div className="ds-cluster" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <Media
            src=""
            alt={exam?.examType ?? 'X-ray exam'}
            ratio="square"
            badge={invoice.status === 'paid' ? 'Paid' : undefined}
          />
          <div className="ds-stack" style={{ gap: '0.25rem' }}>
            <strong>{exam?.examType ?? 'X-ray exam'}</strong>
            <span className="ds-small ds-muted">Invoice #{invoice.id}</span>
          </div>
        </div>

        <div className="ds-between" style={{ marginTop: '1rem' }}>
          <span className="ds-muted">
            <Icon name="dollar" size={16} /> Amount paid
          </span>
          <Price value={invoice.totalAmount} />
        </div>

        <div className="ds-between">
          <span className="ds-muted">
            <Icon name="check" size={16} /> Status
          </span>
          <span>{invoice.status === 'paid' ? 'Paid' : invoice.status}</span>
        </div>

        {invoice.paidAt && (
          <div className="ds-between">
            <span className="ds-muted">
              <Icon name="calendar" size={16} /> Paid on
            </span>
            <span>{new Date(invoice.paidAt).toLocaleDateString()}</span>
          </div>
        )}
      </CardBody>
      <CardFooter>
        <Button variant="primary" size="lg" onClick={onViewInvoices} to={!onViewInvoices ? '/invoices' : undefined}>
          View my invoices
        </Button>
      </CardFooter>
    </Card>
  );
}