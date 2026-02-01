import { Todo } from './todo.entity';

export interface TodoRepository {
  create(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
}
