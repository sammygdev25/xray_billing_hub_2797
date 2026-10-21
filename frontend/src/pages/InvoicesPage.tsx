import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvoiceList } from '../api';
import type { Invoice } from '../types';
import InvoicesHeader from '../components/InvoicesHeader';
import InvoicesContent from '../components/InvoicesContent';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInvoiceList();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleRowClick = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  return (
    <div className="ds-stack-lg">
      <InvoicesHeader />
      <InvoicesContent invoices={invoices} loading={loading} onRowClick={handleRowClick} />
    </div>
  );
}