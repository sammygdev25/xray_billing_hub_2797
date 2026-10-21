import { Section, Grid, Stack } from '../components/ui';
import { Icon } from '../components/icons';
import type { Invoice } from '../types';

interface InvoiceDetailFactsProps {
  invoice: Invoice;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(value?: string | null): string {
  if (!value) return 'Not scheduled';
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function InvoiceDetailFacts({ invoice }: InvoiceDetailFactsProps) {
  const exam = invoice.exam;
  const patient = exam?.patient;
  const patientUser = patient?.user;

  return (
    <Section eyebrow="Details" title="Exam & patient information">
      <Grid cols={2} size="md">
        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="package" size={16} />
            <span className="ds-label">Exam type</span>
          </div>
          <p>{exam?.examType ?? 'Not available'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="calendar" size={16} />
            <span className="ds-label">Scheduled for</span>
          </div>
          <p>{formatDateTime(exam?.scheduledAt)}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="info" size={16} />
            <span className="ds-label">Exam status</span>
          </div>
          <p>{exam?.status ?? 'Not available'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="dollar" size={16} />
            <span className="ds-label">Exam price</span>
          </div>
          <p>${exam?.price ?? '0.00'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="user" size={16} />
            <span className="ds-label">Patient name</span>
          </div>
          <p>{patientUser?.fullName ?? 'Not available'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="mail" size={16} />
            <span className="ds-label">Patient email</span>
          </div>
          <p>{patientUser?.email ?? 'Not available'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="phone" size={16} />
            <span className="ds-label">Patient phone</span>
          </div>
          <p>{patient?.phone || 'Not provided'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="calendar" size={16} />
            <span className="ds-label">Date of birth</span>
          </div>
          <p>{formatDate(patient?.dateOfBirth)}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="map-pin" size={16} />
            <span className="ds-label">Address</span>
          </div>
          <p>{patient?.address || 'Not provided'}</p>
        </Stack>

        <Stack gap="sm">
          <div className="ds-cluster">
            <Icon name="message" size={16} />
            <span className="ds-label">Study notes</span>
          </div>
          <p>{exam?.studyNotes || 'No notes recorded for this exam.'}</p>
        </Stack>
      </Grid>
    </Section>
  );
}