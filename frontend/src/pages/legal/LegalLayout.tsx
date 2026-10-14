import { usePageTitle } from '@/hooks/usePageTitle';

interface Props {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, updatedAt, children }: Props) {
  usePageTitle(title);

  return (
    <article className="mx-auto w-full max-w-[740px] px-5 py-[60px] md:px-6 md:py-20">
      <h1 className="text-[40px] font-semibold md:text-[48px]">{title}</h1>
      <p className="mt-3 text-[15px] text-muted-foreground">Dernière mise à jour : {updatedAt}</p>
      <div className="mt-10 space-y-10 [&_a]:text-primary [&_a:hover]:underline [&_h2]:text-[24px] [&_h2]:font-semibold [&_li]:mt-2 [&_p]:mt-3 [&_p]:text-[17px] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}
