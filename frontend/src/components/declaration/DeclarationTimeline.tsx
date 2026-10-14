import { formatDate } from '@/lib/format';
import type { Declaration, DeclarationStatus } from '@/types';

const ALL_STEPS: { status: DeclarationStatus; label: string }[] = [
  { status: 'DRAFT', label: 'Brouillon' },
  { status: 'SUBMITTED', label: 'Soumise' },
  { status: 'IN_REVIEW', label: 'Examen' },
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
    case 'APPROVED':
    case 'REJECTED':
      return declaration.processingDate ?? null;
    default:
      return null;
  }
}

interface Props {
  declaration: Declaration;
}

export default function DeclarationTimeline({ declaration }: Props) {
  const isRejected = declaration.status === 'REJECTED';
  const currentIndex = STATUS_ORDER[declaration.status];

  const steps = isRejected
    ? [...ALL_STEPS.slice(0, 3), { status: 'REJECTED' as DeclarationStatus, label: 'Rejetée' }]
    : ALL_STEPS;

  return (
    <ol className="flex items-start">
      {steps.map((step, i) => {
        const isDone = i < currentIndex || declaration.status === 'APPROVED';
        const isCurrent = i === currentIndex && !isDone;
        const isRejectStep = step.status === 'REJECTED';
        const date = getDateForStep(declaration, step.status);

        const dotClass = isRejectStep
          ? 'border-destructive bg-destructive'
          : isDone
            ? 'border-success bg-success'
            : isCurrent
              ? 'border-primary bg-primary'
              : 'border-[#d2d2d7] bg-background';

        return (
          <li
            key={step.status}
            aria-current={i === currentIndex ? 'step' : undefined}
            className="flex flex-1 flex-col items-center text-center"
          >
            <div className="flex w-full items-center">
              <div className={`h-px flex-1 ${i === 0 ? 'bg-transparent' : i <= currentIndex ? 'bg-success' : 'bg-[#d2d2d7]'}`} />
              <div className={`size-3 shrink-0 rounded-full border-2 ${dotClass}`} />
              <div
                className={`h-px flex-1 ${
                  i === steps.length - 1 ? 'bg-transparent' : i < currentIndex ? 'bg-success' : 'bg-[#d2d2d7]'
                }`}
              />
            </div>
            <p
              className={`mt-3 text-[13px] ${
                i <= currentIndex ? 'font-medium text-foreground' : 'text-muted-foreground'
              } ${isRejectStep ? 'text-destructive' : ''}`}
            >
              {step.label}
            </p>
            {i <= currentIndex && date && (
              <p className="text-xs text-muted-foreground">
                {formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
