import type { Invoice } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Price, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface InvoiceInfoCardProps {
  invoice: Invoice;
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'pending':
    default:
      return 'soft';
  }
}

function InvoiceInfoCard({ invoice }: InvoiceInfoCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="ds-between">
          <CardTitle>Invoice #{invoice.id}</CardTitle>
          <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
        </div>
        <CardMeta>
          <Icon name="package" size={16} /> {invoice.exam?.examType || 'X-ray exam'}
        </CardMeta>
        <div className="ds-stack" style={{ marginTop: '0.75rem' }}>
          <div className="ds-cluster">
            <Icon name="dollar" size={16} />
            <span className="ds-muted">Total amount</span>
          </div>
          <Price value={Number(invoice.totalAmount)} />
        </div>
        <div className="ds-grid ds-grid-2" style={{ marginTop: '1rem' }}>
          <div>
            <div className="ds-label">Billed to</div>
            <div>{invoice.user?.fullName || 'Patient'}</div>
          </div>
          <div>
            <div className="ds-label">Issued</div>
            <div>{formatDate(invoice.createdAt)}</div>
          </div>
          <div>
            <div className="ds-label">Created by</div>
            <div>{invoice.createdBy?.fullName || '—'}</div>
          </div>
          <div>
            <div className="ds-label">Paid on</div>
            <div>{invoice.paidAt ? formatDate(invoice.paidAt) : 'Not paid yet'}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default InvoiceInfoCard;
export { InvoiceInfoCard };