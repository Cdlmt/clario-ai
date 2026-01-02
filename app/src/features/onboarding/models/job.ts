export type JobCategory = {
  id: string;
  key: string;
  name: string;
  emoji: string;
};

export const JOB_CATEGORIES: JobCategory[] = [
  {
    id: 'software_engineering',
    key: 'software_engineering',
    name: 'Software Engineering',
    emoji: '💻',
  },
  { id: 'ai', key: 'ai', name: 'AI', emoji: '🤖' },
  { id: 'product', key: 'product', name: 'Product Management', emoji: '📦' },
  { id: 'data', key: 'data', name: 'Data', emoji: '📊' },
  { id: 'design', key: 'design', name: 'Design', emoji: '🎨' },
  { id: 'sales', key: 'sales', name: 'Sales', emoji: '💼' },
  { id: 'operations', key: 'operations', name: 'Operations', emoji: '⚙️' },
  { id: 'unknown', key: 'unknown', name: 'Not sure yet', emoji: '❓' },
  { id: 'other', key: 'other', name: 'Other', emoji: '👉' },
];
