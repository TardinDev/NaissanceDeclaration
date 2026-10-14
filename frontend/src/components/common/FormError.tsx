interface Props {
  id?: string;
  message?: string | null;
}

export function FieldError({ id, message }: Props) {
  if (!message) return null;
  return (
    <p id={id} className="text-[13px] text-destructive">
      {message}
    </p>
  );
}

export function FormAlert({ message }: Props) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-lg bg-destructive/8 px-4 py-3 text-[15px] text-destructive">
      {message}
    </div>
  );
}
