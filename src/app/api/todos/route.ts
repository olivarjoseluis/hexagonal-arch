import { NextResponse } from 'next/server';
import { CreateTodoUseCase } from '@/modules/todos/application/create-todo.usecase';
import { GetTodosUseCase } from '@/modules/todos/application/get-todos.usecase';
import { UpdateTodoUseCase } from '@/modules/todos/application/update-todo.usecase';
import { DeleteTodoUseCase } from '@/modules/todos/application/delete-todo.usecase';
import { PrismaUserRepository } from '@/modules/users/infrastructure/repositories/prisma-user.repository';
import { PrismaTodoRepository } from '@/modules/todos/infrastructure/repositories/prisma-todo.repository';
import { verifyAuth } from '@/modules/shared/infrastructure/auth/auth.middleware';
import { z } from 'zod';
import { TodoStatus } from '@/modules/todos/domain/todo.entity';

// Zod Schemas
const createTodoSchema = z.object({
  todo: z.object({
    id: z.string().uuid(),
    description: z.string(),
    status: z.enum(['pending', 'progress', 'done']),
    userId: z.string(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    idTenant: z.string(),
  }),
});

const updateTodoSchema = z.object({
  id: z.string().uuid(),
  description: z.string().optional(),
  status: z.enum(['pending', 'progress', 'done']).optional(),
});

// DI Container (manual)
const userRepository = new PrismaUserRepository();
const todoRepository = new PrismaTodoRepository();
const createTodoUseCase = new CreateTodoUseCase(todoRepository, userRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

export async function POST(request: Request) {
  const authError = verifyAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const result = createTodoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { todo, user } = result.data;
    await createTodoUseCase.execute({
      todo: { ...todo, status: todo.status as TodoStatus },
      user
    });

    return NextResponse.json({ message: 'Todo created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const authError = verifyAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const todos = await getTodosUseCase.execute(userId);
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authError = verifyAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const result = updateTodoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    await updateTodoUseCase.execute({
      id: result.data.id,
      description: result.data.description,
      status: result.data.status as TodoStatus | undefined,
    });

    return NextResponse.json({ message: 'Todo updated' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const status = errorMessage === 'Todo not found' ? 404 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

export async function DELETE(request: Request) {
  const authError = verifyAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    await deleteTodoUseCase.execute(id);
    return NextResponse.json({ message: 'Todo deleted' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const status = errorMessage === 'Todo not found' ? 404 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
