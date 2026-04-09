import type { Declaration, DeclarationStatus } from '@/types';

const ALL_STEPS: { status: DeclarationStatus; label: string }[] = [
  { status: 'DRAFT', label: 'Brouillon' },
  { status: 'SUBMITTED', label: 'Soumise' },
  { status: 'IN_REVIEW', label: 'En cours d\'examen' },
  { status: 'APPROVED', label: 'Approuvée' },
];

const STATUS_ORDER: Record<DeclarationStatus, number> = {
  DRAFT: 0,
  SUBMITTED: 1,
  IN_REVIEW: 2,
  APPROVED: 3,
  REJECTED: 3,
};

function getDateForStep(declaration: Declaration, status: DeclarationStatus): string | null {
  switch (status) {
    case 'DRAFT':
      return declaration.createdAt;
    case 'SUBMITTED':
      return declaration.declarationDate ?? null;
    case 'IN_REVIEW':
      return declaration.status === 'IN_REVIEW' || STATUS_ORDER[declaration.status] > 2
        ? declaration.declarationDate ?? null
        : null;
    case 'APPROVED':
    case 'REJECTED':
      return declaration.processingDate ?? null;
    default:
      return null;
  }
}

function formatDate(date: string | null): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  declaration: Declaration;
}

export default function DeclarationTimeline({ declaration }: Props) {
  const isRejected = declaration.status === 'REJECTED';
  const currentIndex = STATUS_ORDER[declaration.status];

  const steps = isRejected
    ? [
        ...ALL_STEPS.slice(0, 3),
        { status: 'REJECTED' as DeclarationStatus, label: 'Rejetée' },
      ]
    : ALL_STEPS;

  return (
    <div className="flex items-start justify-between gap-2">
      {steps.map((step, i) => {
        const stepIndex = STATUS_ORDER[step.status];
        const isCompleted = currentIndex > stepIndex;
        const isCurrent = currentIndex === stepIndex;
        const isRejectStep = step.status === 'REJECTED';
        const date = getDateForStep(declaration, step.status);

        let dotColor = 'bg-muted border-muted-foreground/30';
        if (isCompleted) dotColor = 'bg-green-500 border-green-500';
        if (isCurrent && !isRejectStep) dotColor = 'bg-primary border-primary';
        if (isCurrent && isRejectStep) dotColor = 'bg-red-500 border-red-500';

        let lineColor = 'bg-muted';
        if (isCompleted) lineColor = 'bg-green-500';

        return (
          <div key={step.status} className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center w-full">
              {i > 0 && <div className={`h-0.5 flex-1 ${i <= currentIndex ? lineColor : 'bg-muted'}`} />}
              <div className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${dotColor}`} />
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < currentIndex ? 'bg-green-500' : 'bg-muted'}`} />}
            </div>
            <p className={`text-xs mt-2 font-medium ${isCurrent ? (isRejectStep ? 'text-red-600' : 'text-primary') : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </p>
            {(isCompleted || isCurrent) && date && (
              <p className="text-[10px] text-muted-foreground">{formatDate(date)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
