import type { Declaration, DeclarationStatus } from '@/types';

export type StatusFilterValue = DeclarationStatus | 'ALL';

const STATUS_FILTERS: { label: string; value: StatusFilterValue }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Brouillons', value: 'DRAFT' },
  { label: 'Soumises', value: 'SUBMITTED' },
  { label: 'En cours', value: 'IN_REVIEW' },
  { label: 'Approuvées', value: 'APPROVED' },
  { label: 'Rejetées', value: 'REJECTED' },
];

interface Props {
  declarations: Declaration[];
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

export default function StatusFilter({ declarations, value, onChange }: Props) {
  const count = (status: StatusFilterValue) =>
    status === 'ALL' ? declarations.length : declarations.filter((d) => d.status === status).length;

  return (
    <div role="group" aria-label="Filtrer par statut" className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          aria-pressed={value === f.value}
          className={`h-9 rounded-full px-4 text-sm transition-colors outline-none focus-visible:ring-4 focus-visible:ring-ring/30 ${
            value === f.value ? 'bg-ink text-white' : 'bg-muted text-foreground hover:bg-border'
          }`}
        >
          {f.label}
          <span className={`ml-1.5 tabular-nums ${value === f.value ? 'text-white/70' : 'text-muted-foreground'}`}>
            {count(f.value)}
          </span>
        </button>
      ))}
    </div>
  );
}
