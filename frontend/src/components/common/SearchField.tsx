import { Input } from '@/components/ui/input';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function SearchField({ value, onChange, label }: Props) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Nom ou référence"
      aria-label={label}
      className="h-10 rounded-full bg-muted px-4 text-[15px] md:w-72"
    />
  );
}
