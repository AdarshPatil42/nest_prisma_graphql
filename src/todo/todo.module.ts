import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodoController } from './todo.controller';

@Module({
  providers: [TodoResolver, TodoService, PrismaService],
  controllers: [TodoController],
})
export class TodoModule { }
