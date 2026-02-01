import prisma from '@/modules/shared/infrastructure/persistence/prisma.client';
import { Todo, TodoStatus } from '../../domain/todo.entity';
import { TodoRepository } from '../../domain/todo.repository';

export class PrismaTodoRepository implements TodoRepository {
  async create(todo: Todo): Promise<void> {
    await prisma.todo.create({
      data: {
        id: todo.id,
        description: todo.description,
        status: todo.status,
        userId: todo.userId,
      },
    });
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const todos = await prisma.todo.findMany({ where: { userId } });
    return todos.map((t: { id: string; description: string; status: string; userId: string; createdAt: Date; updatedAt: Date }) => ({
      id: t.id,
      description: t.description,
      status: t.status as TodoStatus,
      userId: t.userId,
    }));
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return null;
    return {
      id: todo.id,
      description: todo.description,
      status: todo.status as TodoStatus,
      userId: todo.userId,
    };
  }

  async update(todo: Todo): Promise<void> {
    await prisma.todo.update({
      where: { id: todo.id },
      data: {
        description: todo.description,
        status: todo.status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.todo.delete({ where: { id } });
  }
}
