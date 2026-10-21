import { Section, Card, CardBody, EmptyState, Badge, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import { Link } from 'react-router-dom';
import type { Exam, Invoice } from '../types';

interface StaffDashboardRecentProps {
  recentExams: Exam[];
  recentInvoices: Invoice[];
}

function statusTone(status: string): 'neutral' | 'primary' | 'soft' | 'success' | 'danger' {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'success';
    case 'cancelled':
      return 'danger';
    case 'scheduled':
    case 'pending':
      return 'primary';
    default:
      return 'neutral';
  }
}

export default function StaffDashboardRecent({ recentExams, recentInvoices }: StaffDashboardRecentProps) {
  return (
    <Section
      eyebrow="Activity"
      title="Recent activity"
      subtitle="Latest exams scheduled and invoices issued across the lab"
    >
      <div className="ds-grid-split">
        <Card>
          <CardBody>
            <Stack gap="sm">
              <h3>Recent exams</h3>
              {recentExams.length === 0 ? (
                <EmptyState
                  icon="calendar"
                  title="No exams yet"
                  text="Scheduled X-ray exams will appear here."
                />
              ) : (
                <div className="ds-table-wrap">
                  <table className="ds-table">
                    <thead>
                      <tr>
                        <th>Exam type</th>
                        <th>Scheduled</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentExams.map((exam) => (
                        <tr key={exam.id}>
                          <td>
                            <Link to={`/exams/${exam.id}`}>{exam.examType}</Link>
                          </td>
                          <td>{new Date(exam.scheduledAt).toLocaleDateString()}</td>
                          <td>
                            <Badge tone={statusTone(exam.status)}>{exam.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stack gap="sm">
              <h3>Recent invoices</h3>
              {recentInvoices.length === 0 ? (
                <EmptyState
                  icon="credit-card"
                  title="No invoices yet"
                  text="Billing invoices created for exams will appear here."
                />
              ) : (
                <div className="ds-table-wrap">
                  <table className="ds-table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>
                            <Link to={`/invoices/${invoice.id}`}>
                              <Icon name="credit-card" size={14} /> Invoice #{invoice.id}
                            </Link>
                          </td>
                          <td>${Number(invoice.totalAmount).toFixed(2)}</td>
                          <td>
                            <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Stack>
          </CardBody>
        </Card>
      </div>
    </Section>
  );
}