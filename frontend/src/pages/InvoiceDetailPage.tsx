import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice, getInvoiceList } from '../api';
import type { Invoice } from '../types';
import InvoiceDetailMedia from '../components/InvoiceDetailMedia';
import InvoiceDetailFacts from '../components/InvoiceDetailFacts';
import InvoiceDetailRelated from '../components/InvoiceDetailRelated';
import { LoadingBlock, Alert, EmptyState } from '../components/ui';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [relatedInvoices, setRelatedInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getInvoice(id);
      setInvoice(data);
      const all = await getInvoiceList();
      const related = all.filter(
        (inv) => inv.id !== data.id && inv.user === data.user
      );
      setRelatedInvoices(related.slice(0, 6));
    } catch (err) {
      console.error(err);
      setError('Unable to load this invoice. It may have been removed or you do not have access to it.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePayClick = () => {
    navigate(`/invoices/${id}`);
  };

  if (loading) {
    return <LoadingBlock label="Loading invoice details..." />;
  }

  if (error) {
    return <Alert tone="danger">{error}</Alert>;
  }

  if (!invoice) {
    return (
      <EmptyState
        icon="info"
        title="Invoice not found"
        text="This invoice does not exist or has been removed."
      />
    );
  }

  return (
    <div className="ds-stack-lg">
      <InvoiceDetailMedia invoice={invoice} onPayClick={handlePayClick} />
      <InvoiceDetailFacts invoice={invoice} />
      <InvoiceDetailRelated invoice={invoice} relatedInvoices={relatedInvoices} />
    </div>
  );
}