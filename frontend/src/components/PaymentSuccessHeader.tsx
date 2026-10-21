import { PageHeader, Badge } from '../components/ui';
import { Icon } from '../components/icons';

interface PaymentSuccessHeaderProps {
  invoiceId?: string;
}

export default function PaymentSuccessHeader({ invoiceId }: PaymentSuccessHeaderProps) {
  return (
    <PageHeader
      eyebrow="Billing"
      title="Payment received"
      subtitle={
        invoiceId
          ? `Invoice #${invoiceId} has been paid. A confirmation has been recorded on your account.`
          : 'Your invoice has been paid. A confirmation has been recorded on your account.'
      }
      actions={
        <Badge tone="success">
          <Icon name="check" size={14} /> Payment complete
        </Badge>
      }
    />
  );
}