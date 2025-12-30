export type Question = {
  id: string;
  text: string;
  category?: string;
  createdAt: number;
};

export function createQuestion(text: string, category?: string): Question {
  return {
    id: crypto.randomUUID(),
    text,
    category,
    createdAt: Date.now(),
  };
}
