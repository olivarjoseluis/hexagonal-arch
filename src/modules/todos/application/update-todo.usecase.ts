import { TodoRepository } from '../domain/todo.repository';
import { Todo, TodoStatus } from '../domain/todo.entity';

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) { }

  async execute(input: { id: string; description?: string; status?: TodoStatus }): Promise<void> {
    const existingTodo = await this.todoRepository.findById(input.id);
    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      description: input.description ?? existingTodo.description,
      status: input.status ?? existingTodo.status,
    };

    await this.todoRepository.update(updatedTodo);
  }
}
