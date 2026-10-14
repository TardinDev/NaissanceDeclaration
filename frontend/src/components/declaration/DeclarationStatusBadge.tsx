import type { DeclarationStatus } from '@/types';

const STATUS_CONFIG: Record<DeclarationStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Brouillon', className: 'bg-black/6 text-muted-foreground' },
  SUBMITTED: { label: 'Soumise', className: 'bg-primary/10 text-primary' },
  IN_REVIEW: { label: "En cours d'examen", className: 'bg-warning/10 text-warning' },
  APPROVED: { label: 'Approuvée', className: 'bg-success/10 text-success' },
  REJECTED: { label: 'Rejetée', className: 'bg-destructive/10 text-destructive' },
};

interface Props {
  status: DeclarationStatus;
}

export default function DeclarationStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}
