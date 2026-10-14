import { useState } from 'react';
import { Input } from '@/components/ui/input';

type Props = Omit<React.ComponentProps<'input'>, 'type'>;

export default function PasswordInput(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} className="pr-24" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-[13px] text-primary outline-none hover:underline focus-visible:underline"
      >
        {visible ? 'Masquer' : 'Afficher'}
      </button>
    </div>
  );
}
