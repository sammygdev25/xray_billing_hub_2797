import { Section, Split, Media, CardMeta, Price, Badge, Button } from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice } from '../types';

interface InvoiceDetailMediaProps {
  invoice: Invoice;
  onPayClick?: () => void;
}

function statusTone(status: string): 'success' | 'primary' | 'danger' | 'neutral' {
  if (status === 'paid') return 'success';
  if (status === 'pending') return 'primary';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

export default function InvoiceDetailMedia({ invoice, onPayClick }: InvoiceDetailMediaProps) {
  const examType = invoice.exam?.examType ?? 'X-ray Exam';
  const isPending = invoice.status === 'pending';

  return (
    <Section tight>
      <Split>
        <Media
          src=""
          alt={`Invoice for ${examType}`}
          ratio="square"
          badge={invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        />
        <div className="ds-stack">
          <span className="ds-eyebrow">Invoice #{invoice.id}</span>
          <h1 className="ds-card-title">{examType}</h1>
          <CardMeta>
            <Icon name="calendar" size={16} />
            {invoice.exam?.scheduledAt
              ? new Date(invoice.exam.scheduledAt).toLocaleDateString()
              : new Date(invoice.createdAt).toLocaleDateString()}
          </CardMeta>
          <div className="ds-cluster">
            <Price value={Number(invoice.totalAmount)} />
            <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
          </div>
          <p className="ds-muted ds-small">
            This invoice covers the X-ray lab services billed for {examType.toLowerCase()}.
            {isPending
              ? ' Payment is due to settle this balance.'
              : invoice.status === 'paid'
              ? ' This invoice has been paid in full.'
              : ' This invoice has been cancelled.'}
          </p>
          {isPending && onPayClick && (
            <Button variant="primary" size="lg" onClick={onPayClick}>
              <Icon name="credit-card" size={18} />
              Pay Now
            </Button>
          )}
        </div>
      </Split>
    </Section>
  );
}