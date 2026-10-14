import { Link } from 'react-router-dom';
import DeclarationStatusBadge from './DeclarationStatusBadge';
import { formatDate } from '@/lib/format';
import type { Declaration } from '@/types';

interface Props {
  declaration: Declaration;
  linkPrefix: string;
}

export default function DeclarationCard({ declaration, linkPrefix }: Props) {
  return (
    <Link
      to={`${linkPrefix}/${declaration.id}`}
      className="group flex h-full flex-col rounded-card bg-muted p-6 transition-colors outline-none hover:bg-border focus-visible:ring-4 focus-visible:ring-ring/30"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-muted-foreground tabular-nums">{declaration.reference}</p>
        <DeclarationStatusBadge status={declaration.status} />
      </div>
      <h3 className="mt-5 text-[21px] font-semibold">
        {declaration.childFirstNames} {declaration.childLastName}
      </h3>
      <p className="mt-2 flex-1 text-[15px] text-muted-foreground">
        Né(e) le {formatDate(declaration.childBirthDate)}
        <br />
        {declaration.childBirthPlace}
      </p>
      <p className="mt-5 text-[15px] text-primary group-hover:underline">
        Voir le détail <span aria-hidden="true">›</span>
      </p>
    </Link>
  );
}
