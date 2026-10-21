import type { Invoice } from '../types';
import { Badge, Price, EmptyState } from '../components/ui';
import type { BadgeTone } from '../components/ui';

interface InvoiceTableProps {
  invoices: Invoice[];
  onRowClick: (invoice: Invoice) => void;
}

function statusTone(status: string): BadgeTone {
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

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function InvoiceTable({ invoices, onRowClick }: InvoiceTableProps) {
  if (!invoices || invoices.length === 0) {
    return (
      <EmptyState
        icon="credit-card"
        title="No invoices yet"
        text="Invoices for completed exams will appear here once billing staff create them."
      />
    );
  }

  return (
    <div className="ds-table-wrap">
      <table className="ds-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Exam</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              onClick={() => onRowClick(invoice)}
              style={{ cursor: 'pointer' }}
            >
              <td>#{invoice.id}</td>
              <td>{invoice.exam?.examType ?? `Exam #${invoice.examId}`}</td>
              <td>
                <Price value={invoice.totalAmount} />
              </td>
              <td>
                <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
              </td>
              <td className="ds-muted">{formatDate(invoice.createdAt)}</td>
              <td className="ds-muted">{formatDate(invoice.paidAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;