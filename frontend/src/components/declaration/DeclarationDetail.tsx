import DeclarationStatusBadge from './DeclarationStatusBadge';
import DeclarationTimeline from './DeclarationTimeline';
import { formatDate } from '@/lib/format';
import type { Declaration } from '@/types';

interface Props {
  declaration: Declaration;
  actions?: React.ReactNode;
}

function Section({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  return (
    <section className="rounded-card bg-muted p-7">
      <h2 className="text-[21px] font-semibold">{title}</h2>
      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[13px] text-muted-foreground">{label}</dt>
            <dd className="text-[17px]">{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function DeclarationDetail({ declaration, actions }: Props) {
  const d = declaration;
  const optionalDate = (date?: string) => (date ? formatDate(date) : undefined);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[15px] text-muted-foreground tabular-nums">
            {d.reference} · créée le {formatDate(d.createdAt)}
          </p>
          <h1 className="mt-2 text-[32px] font-semibold md:text-[40px]">
            {d.childFirstNames} {d.childLastName}
          </h1>
          <div className="mt-4">
            <DeclarationStatusBadge status={d.status} />
          </div>
        </div>
        {actions && <div className="no-print flex flex-wrap gap-3">{actions}</div>}
      </header>

      <div className="rounded-card bg-muted px-4 py-7 md:px-7">
        <DeclarationTimeline declaration={d} />
      </div>

      {(d.agentComment || d.processedByName) && (
        <section
          className={`rounded-card p-7 ${
            d.status === 'REJECTED' ? 'bg-destructive/8' : d.status === 'APPROVED' ? 'bg-success/8' : 'bg-muted'
          }`}
        >
          <h2 className="text-[21px] font-semibold">Décision du service</h2>
          {d.agentComment && <p className="mt-3 text-[17px]">{d.agentComment}</p>}
          <p className="mt-3 text-[13px] text-muted-foreground">
            {d.processedByName && <>Traité par {d.processedByName}</>}
            {d.processedByName && d.processingDate && ' · '}
            {d.processingDate && formatDate(d.processingDate)}
          </p>
        </section>
      )}

      <Section
        title="L'enfant"
        rows={[
          ['Nom', d.childLastName],
          ['Prénom(s)', d.childFirstNames],
          ['Date de naissance', formatDate(d.childBirthDate)],
          ['Lieu de naissance', d.childBirthPlace],
          ['Sexe', d.childGender],
        ]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section
          title="Le père"
          rows={[
            ['Nom', d.fatherLastName],
            ['Prénom(s)', d.fatherFirstNames],
            ['Date de naissance', optionalDate(d.fatherBirthDate)],
            ['Nationalité', d.fatherNationality],
            ['Profession', d.fatherProfession],
            ['Adresse', d.fatherAddress],
          ]}
        />
        <Section
          title="La mère"
          rows={[
            ['Nom', d.motherLastName],
            ['Prénom(s)', d.motherFirstNames],
            ['Date de naissance', optionalDate(d.motherBirthDate)],
            ['Nationalité', d.motherNationality],
            ['Profession', d.motherProfession],
            ['Adresse', d.motherAddress],
          ]}
        />
      </div>

      <Section
        title="Le déclarant"
        rows={[
          ['Nom', d.declarantLastName],
          ['Prénom(s)', d.declarantFirstNames],
          ['Qualité', d.declarantQuality],
        ]}
      />
    </div>
  );
}
