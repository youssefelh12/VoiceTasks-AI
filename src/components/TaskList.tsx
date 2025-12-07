'use client';

import { useEffect, useState } from 'react';
import TaskRow from './TaskRow';
import LoadingOverlay from './LoadingOverlay';

type Task = {
  id: number;
  title: string;
  status: 'open' | 'done' | string;
  createdAt: string;
};

type TaskListProps = {
  refreshToken: number;
};

export default function TaskList({ refreshToken }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
      setError('Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  const toggleStatus = async (task: Task) => {
    const nextStatus = task.status === 'done' ? 'open' : 'done';
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (response.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
      );
    }
  };

  const deleteTask = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
    if (response.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg font-semibold">Your tasks</p>
          <p className="text-slate-400 text-sm">Check off items as you finish them.</p>
        </div>
        <span className="text-xs bg-slate-700 rounded-full px-3 py-1 text-slate-200">{tasks.length} items</span>
      </div>

      {loading && <LoadingOverlay label="Loading tasks" />}
      {error && <p className="text-rose-300 text-sm mb-2">{error}</p>}

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={() => toggleStatus(task)}
            onDelete={() => deleteTask(task)}
          />
        ))}
        {!loading && tasks.length === 0 && (
          <p className="text-slate-400 text-sm">No tasks yet. Record a note to get started!</p>
        )}
      </div>
    </div>
  );
}
