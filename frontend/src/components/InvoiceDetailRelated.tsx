import type { Invoice } from '../types';
import { Section, Grid, Card, CardBody, CardTitle, CardMeta, Badge, Price } from '../components/ui';
import { Icon } from '../components/icons';

interface InvoiceDetailRelatedProps {
  invoice: Invoice;
  relatedInvoices: Invoice[];
}

export default function InvoiceDetailRelated({ invoice, relatedInvoices }: InvoiceDetailRelatedProps) {
  const items = relatedInvoices.filter((i) => i.id !== invoice.id).slice(0, 6);

  if (items.length === 0) {
    return null;
  }

  return (
    <Section
      eyebrow="Same patient"
      title="Other invoices for this patient"
      subtitle="Billing history tied to the same account, useful when reviewing outstanding balances."
    >
      <Grid size="sm">
        {items.map((item) => (
          <Card key={item.id} to={`/invoices/${item.id}`}>
            <CardBody>
              <CardTitle>
                <Icon name="credit-card" size={16} /> Invoice #{item.id}
              </CardTitle>
              <CardMeta>{item.exam?.examType ?? 'X-ray exam'}</CardMeta>
              <div className="ds-between">
                <Price value={item.totalAmount} />
                <Badge
                  tone={
                    item.status === 'paid'
                      ? 'success'
                      : item.status === 'cancelled'
                      ? 'danger'
                      : 'soft'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}