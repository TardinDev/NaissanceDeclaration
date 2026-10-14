import { Link } from 'react-router-dom';

interface Props {
  to: string;
  children: React.ReactNode;
}

export default function BackLink({ to, children }: Props) {
  return (
    <Link to={to} className="no-print inline-block text-[15px] text-primary hover:underline">
      <span aria-hidden="true">‹</span> {children}
    </Link>
  );
}
