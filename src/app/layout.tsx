import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VoiceTasks AI',
  description: 'Record voice notes, transcribe, and capture tasks automatically.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
