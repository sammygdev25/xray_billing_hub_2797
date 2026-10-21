import { Link } from 'react-router-dom';
import { Card, CardBody, Badge, EmptyState, Icon } from '../components/ui';
import type { Invoice } from '../types';

interface InvoiceHistoryListProps {
  invoices: Invoice[];
}

function toneForStatus(status: string): 'neutral' | 'success' | 'danger' | 'soft' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'pending':
      return 'soft';
    default:
      return 'neutral';
  }
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function InvoiceHistoryList({ invoices }: InvoiceHistoryListProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <EmptyState
        icon="credit-card"
        title="No billing history yet"
        text="Once an exam is invoiced, it will show up here with its payment status."
      />
    );
  }

  return (
    <div className="ds-stack" style={{ gap: 'var(--space-sm, 0.75rem)' }}>
      {invoices.map((invoice) => (
        <Card key={invoice.id} to={`/invoices/${invoice.id}`}>
          <CardBody>
            <div className="ds-between">
              <div className="ds-stack" style={{ gap: '0.25rem' }}>
                <strong>{invoice.exam?.examType ?? `Invoice #${invoice.id}`}</strong>
                <span className="ds-small ds-muted">
                  <Icon name="calendar" size={14} /> Billed {formatDate(invoice.createdAt)}
                  {invoice.paidAt ? ` · Paid ${formatDate(invoice.paidAt)}` : ''}
                </span>
              </div>
              <div className="ds-stack" style={{ gap: '0.25rem', alignItems: 'flex-end' }}>
                <span className="ds-price">${Number(invoice.totalAmount).toFixed(2)}</span>
                <Badge tone={toneForStatus(invoice.status)}>{invoice.status}</Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default InvoiceHistoryList;
export { InvoiceHistoryList };