import { PageHeader } from '../components/ui';
import { Icon } from '../components/icons';

interface PaymentCancelHeaderProps {
  invoiceId?: string | number;
}

export default function PaymentCancelHeader({ invoiceId }: PaymentCancelHeaderProps) {
  return (
    <PageHeader
      eyebrow="Payment"
      title="Payment cancelled"
      subtitle={
        invoiceId
          ? `Your payment for invoice #${invoiceId} was not completed. No charge was made to your card.`
          : 'Your payment was not completed. No charge was made to your card.'
      }
      actions={
        <div className="ds-cluster">
          <Icon name="alert" size={20} title="Payment cancelled" />
          <span className="ds-small ds-muted">Step 2 of 2 &middot; Checkout cancelled</span>
        </div>
      }
    />
  );
}