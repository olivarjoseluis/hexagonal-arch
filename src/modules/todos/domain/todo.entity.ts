export type TodoStatus = 'pending' | 'progress' | 'done';

export interface Todo {
  id: string;
  description: string;
  status: TodoStatus;
  userId: string;
}
