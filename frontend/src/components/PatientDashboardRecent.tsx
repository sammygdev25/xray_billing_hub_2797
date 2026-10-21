import { Section, Stack, EmptyState, Badge } from '../components/ui';
import { Icon } from '../components/icons';
import { Link } from 'react-router-dom';
import type { Exam, Invoice } from '../types';

interface PatientDashboardRecentProps {
  exams: Exam[];
  invoices: Invoice[];
  loading?: boolean;
}

function examStatusTone(status: string) {
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'primary';
}

function invoiceStatusTone(status: string) {
  if (status === 'paid') return 'success';
  if (status === 'cancelled') return 'danger';
  return 'soft';
}

export default function PatientDashboardRecent({ exams, invoices, loading }: PatientDashboardRecentProps) {
  return (
    <Section eyebrow="Recent activity" title="Your exams and invoices">
      <Stack gap="lg">
        <div>
          <h3 className="ds-card-title">Upcoming &amp; recent exams</h3>
          {loading ? null : exams.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No exams yet"
              text="Once a receptionist schedules an X-ray exam for you, it will show up here."
            />
          ) : (
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id}>
                      <td>
                        <Link to={`/exams/${exam.id}`}>{exam.examType}</Link>
                      </td>
                      <td>{new Date(exam.scheduledAt).toLocaleDateString()}</td>
                      <td>
                        <Badge tone={examStatusTone(exam.status) as any}>{exam.status}</Badge>
                      </td>
                      <td>${Number(exam.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 className="ds-card-title">Recent invoices</h3>
          {loading ? null : invoices.length === 0 ? (
            <EmptyState
              icon="credit-card"
              title="No invoices yet"
              text="Invoices for your completed exams will appear here so you can review and pay them."
            />
          ) : (
            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <Link to={`/invoices/${invoice.id}`}>Invoice #{invoice.id}</Link>
                      </td>
                      <td>${Number(invoice.totalAmount).toFixed(2)}</td>
                      <td>
                        <Badge tone={invoiceStatusTone(invoice.status) as any}>{invoice.status}</Badge>
                      </td>
                      <td>
                        {invoice.status === 'pending' ? (
                          <Link to={`/invoices/${invoice.id}`}>
                            <Icon name="arrow-right" size={16} title="View invoice" />
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Stack>
    </Section>
  );
}