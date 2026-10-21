import { PageHeader } from '../components/ui';

interface InvoicesHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function InvoicesHeader({
  title = 'Your Invoices',
  subtitle = 'Review your X-ray exam charges and pay outstanding balances securely online.',
}: InvoicesHeaderProps) {
  return <PageHeader title={title} subtitle={subtitle} />;
}