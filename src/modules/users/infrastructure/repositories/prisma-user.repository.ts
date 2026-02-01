import prisma from '@/modules/shared/infrastructure/persistence/prisma.client';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      idTenant: user.idTenant,
    };
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        idTenant: user.idTenant,
      },
    });
  }
}
