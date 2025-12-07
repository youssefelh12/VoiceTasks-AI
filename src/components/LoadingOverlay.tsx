'use client';

type LoadingOverlayProps = {
  label?: string;
};

export default function LoadingOverlay({ label = 'Loading' }: LoadingOverlayProps) {
  return (
    <div className="w-full flex items-center gap-3 text-slate-200">
      <div className="h-4 w-4 border-2 border-slate-500 border-t-emerald-400 rounded-full animate-spin" />
      <span className="text-sm">{label}...</span>
    </div>
  );
}
