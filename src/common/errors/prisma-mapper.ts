import { Prisma } from '@prisma/client';
import { DomainError } from './domain-error';

export function mapPrismaError(e: any): DomainError | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      const meta = e.meta as any;
      const field = Array.isArray(meta?.target) ? meta.target[0] : 'field';
      return new DomainError('RESOURCE_CONFLICT', 'db.unique_conflict', { field }, 409);
    }
    if (e.code === 'P2025') {
      return new DomainError('NOT_FOUND', 'db.not_found', {}, 404);
    }
  }
  return null;
}
