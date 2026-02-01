import { TodoRepository } from '../domain/todo.repository';
import { Todo } from '../domain/todo.entity';

export class GetTodosUseCase {
  constructor(private readonly todoRepository: TodoRepository) { }

  async execute(userId: string): Promise<Todo[]> {
    return this.todoRepository.findByUserId(userId);
  }
}
