import { TodoRepository } from '../domain/todo.repository';
import { UserRepository } from '../../users/domain/user.repository';
import { Todo } from '../domain/todo.entity';
import { User } from '../../users/domain/user.entity';

export class CreateTodoUseCase {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly userRepository: UserRepository
  ) { }

  async execute(input: { todo: Todo; user: User }): Promise<void> {
    const existingUser = await this.userRepository.findById(input.user.id);
    if (!existingUser) {
      await this.userRepository.create(input.user);
    }
    await this.todoRepository.create(input.todo);
  }
}
