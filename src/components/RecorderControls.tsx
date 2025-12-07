'use client';

import { useEffect, useRef, useState } from 'react';

type RecorderControlsProps = {
  onProcessingStart?: () => void;
  onProcessingEnd?: () => void;
  onError?: (message: string) => void;
  onTasksCreated?: () => void;
};

type RecordingState = 'idle' | 'recording' | 'processing';

export default function RecorderControls({
  onProcessingEnd,
  onProcessingStart,
  onError,
  onTasksCreated,
}: RecorderControlsProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedMs((prev) => prev + 1000);
    }, 1000);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedMs(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setRecordingState('processing');
        onProcessingStart?.();
        try {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          await sendAudio(blob);
          onTasksCreated?.();
        } catch (error) {
          console.error(error);
          onError?.('Failed to process audio. Please try again.');
        } finally {
          setRecordingState('idle');
          resetTimer();
          onProcessingEnd?.();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecordingState('recording');
      startTimer();
    } catch (error) {
      console.error(error);
      onError?.('Microphone permission denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'voice-note.webm');
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Failed to process audio');
    }

    return response.json();
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">Capture a quick voice note</p>
          <p className="text-slate-400 text-sm">Press start, speak, then stop to create tasks automatically.</p>
        </div>
        <div className="text-3xl font-mono text-emerald-400">{formatTime(elapsedMs)}</div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={startRecording}
          disabled={recordingState !== 'idle'}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-slate-900 disabled:bg-slate-600 transition"
        >
          Start recording
        </button>
        <button
          onClick={stopRecording}
          disabled={recordingState !== 'recording'}
          className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 font-semibold text-slate-900 disabled:bg-slate-600 transition"
        >
          Stop &amp; save
        </button>
      </div>

      {recordingState === 'recording' && (
        <p className="text-sm text-amber-300 mt-3">Recording... speak naturally and tap stop when done.</p>
      )}
      {recordingState === 'processing' && (
        <p className="text-sm text-sky-300 mt-3">Processing your audio with AI...</p>
      )}
    </div>
  );
}
