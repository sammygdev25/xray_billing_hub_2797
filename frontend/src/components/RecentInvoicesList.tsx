import { Link } from 'react-router-dom';
import type { Invoice } from '../types';
import { Card, CardBody, CardTitle, CardMeta, Price, Badge, EmptyState, Stack } from './ui';

interface RecentInvoicesListProps {
  invoices: Invoice[];
}

function statusTone(status: string): 'success' | 'primary' | 'danger' | 'neutral' {
  if (status === 'paid') return 'success';
  if (status === 'pending') return 'primary';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

function RecentInvoicesList({ invoices }: RecentInvoicesListProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <EmptyState
        icon="credit-card"
        title="No invoices yet"
        text="Invoices for your exams will show up here once billing issues them."
      />
    );
  }

  const recent = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Stack gap="sm">
      {recent.map((invoice) => (
        <Card key={invoice.id} to={`/invoices/${invoice.id}`}>
          <CardBody>
            <Stack gap="xs">
              <div className="ds-between">
                <CardTitle>Invoice #{invoice.id}</CardTitle>
                <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
              </div>
              <CardMeta>
                {invoice.exam?.examType ? invoice.exam.examType : 'X-ray exam'}
                {' · '}
                {new Date(invoice.createdAt).toLocaleDateString()}
              </CardMeta>
              <Price value={Number(invoice.totalAmount)} />
            </Stack>
          </CardBody>
        </Card>
      ))}
      <div className="ds-cluster" style={{ justifyContent: 'flex-end' }}>
        <Link to="/invoices" className="ds-muted ds-small">
          View all invoices
        </Link>
      </div>
    </Stack>
  );
}

export default RecentInvoicesList;
export { RecentInvoicesList };