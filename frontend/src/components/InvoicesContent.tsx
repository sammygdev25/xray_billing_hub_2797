import { Section, Grid, Card, CardBody, CardTitle, CardMeta, CardFooter, Price, Badge, SkeletonCards, EmptyState } from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice } from '../types';

interface InvoicesContentProps {
  invoices: Invoice[];
  loading?: boolean;
  onRowClick?: (invoice: Invoice) => void;
}

function statusTone(status: string): 'success' | 'primary' | 'danger' | 'neutral' {
  if (status === 'paid') return 'success';
  if (status === 'pending') return 'primary';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

export default function InvoicesContent({ invoices, loading, onRowClick }: InvoicesContentProps) {
  if (loading) {
    return (
      <Section title="Your invoices" subtitle="X-ray exam billing and payment status">
        <SkeletonCards count={6} />
      </Section>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Section title="Your invoices" subtitle="X-ray exam billing and payment status">
        <EmptyState
          icon="credit-card"
          title="No invoices yet"
          text="Invoices for your completed X-ray exams will show up here once billing issues them."
        />
      </Section>
    );
  }

  return (
    <Section title="Your invoices" subtitle="X-ray exam billing and payment status">
      <Grid size="md" cols={3}>
        {invoices.map((invoice) => (
          <Card key={invoice.id} onClick={onRowClick ? () => onRowClick(invoice) : undefined}>
            <CardBody>
              <CardTitle>
                {invoice.exam?.examType ?? `Invoice #${invoice.id}`}
              </CardTitle>
              <CardMeta>
                <Icon name="calendar" size={14} />
                {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'Unknown date'}
              </CardMeta>
              <CardFooter>
                <Price value={Number(invoice.totalAmount)} />
                <Badge tone={statusTone(invoice.status)}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </CardFooter>
              {invoice.status !== 'paid' && (
                <CardMeta>
                  <Icon name="alert" size={14} />
                  Payment required
                </CardMeta>
              )}
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}