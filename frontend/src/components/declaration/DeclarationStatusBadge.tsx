import { Badge } from '@/components/ui/badge';
import type { DeclarationStatus } from '@/types';

const statusConfig: Record<DeclarationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DRAFT: { label: 'Brouillon', variant: 'secondary' },
  SUBMITTED: { label: 'Soumise', variant: 'outline' },
  IN_REVIEW: { label: 'En cours', variant: 'default' },
  APPROVED: { label: 'Approuvée', variant: 'default' },
  REJECTED: { label: 'Rejetée', variant: 'destructive' },
};

interface Props {
  status: DeclarationStatus;
}

export default function DeclarationStatusBadge({ status }: Props) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={
        status === 'APPROVED'
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : status === 'IN_REVIEW'
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : status === 'SUBMITTED'
              ? 'border-blue-500 text-blue-600'
              : ''
      }
    >
      {config.label}
    </Badge>
  );
}
