export default function LoadingSpinner() {
  return (
    <div role="status" className="flex items-center justify-center py-20">
      <div className="size-7 animate-spin rounded-full border-2 border-[#d2d2d7] border-t-foreground" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
