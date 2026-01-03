export interface Question {
  id: number;
  created_at: string;
  text: string;
  category?: number;
  industry?: number;
}

export interface QuestionWithRelations
  extends Omit<Question, 'category' | 'industry'> {
  category?: {
    id: number;
    key: string;
    name: string;
  };
  industry?: {
    id: number;
    key: string;
    name: string;
    icon?: string;
  };
}
