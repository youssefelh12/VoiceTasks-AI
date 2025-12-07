'use client';

type TaskRowProps = {
  task: {
    id: number;
    title: string;
    status: string;
    createdAt: string;
  };
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const isDone = task.status === 'done';
  const createdDate = new Date(task.createdAt).toLocaleString();

  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-3 py-3">
      <input
        type="checkbox"
        checked={isDone}
        onChange={onToggle}
        className="h-5 w-5 rounded border-slate-600 text-emerald-500"
      />
      <div className="flex-1">
        <p className={`font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>{task.title}</p>
        <p className="text-xs text-slate-500">Created {createdDate}</p>
      </div>
      <button
        onClick={onDelete}
        className="text-xs text-rose-300 hover:text-rose-200 transition"
      >
        Delete
      </button>
    </div>
  );
}
