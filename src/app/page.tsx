'use client';

import { useState } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import RecorderControls from '@/components/RecorderControls';
import TaskList from '@/components/TaskList';

export default function HomePage() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <header className="text-center space-y-3">
        <p className="text-emerald-300 text-sm font-semibold tracking-wide">VOICE TASKS AI</p>
        <h1 className="text-3xl md:text-4xl font-bold">Speak your to-dos, let AI organize them.</h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Record a quick voice note, and VoiceTasks AI will transcribe, summarize, and create actionable tasks you can check off.
        </p>
      </header>

      {error && (
        <div className="bg-rose-900/40 border border-rose-700 text-rose-100 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <RecorderControls
          onProcessingStart={() => {
            setProcessing(true);
            setError(null);
          }}
          onProcessingEnd={() => setProcessing(false)}
          onError={(msg) => setError(msg)}
          onTasksCreated={() => setRefreshToken((prev) => prev + 1)}
        />

        <TaskList refreshToken={refreshToken} />
      </div>

      {processing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
            <LoadingOverlay label="Processing your note" />
            <p className="text-sm text-slate-300 text-center">
              We are transcribing your audio and turning it into clear tasks.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
