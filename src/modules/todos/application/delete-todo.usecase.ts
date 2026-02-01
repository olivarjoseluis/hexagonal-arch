import { TodoRepository } from '../domain/todo.repository';

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) { }

  async execute(id: string): Promise<void> {
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error('Todo not found');
    }
    await this.todoRepository.delete(id);
  }
}
