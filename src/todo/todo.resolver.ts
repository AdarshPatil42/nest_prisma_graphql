import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { I18n, I18nContext } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) { }

  @Mutation(() => Todo)
  createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput) {
    return this.todoService.create(createTodoInput);
  }

  @Query(() => [Todo], { name: 'todos' })
  findAll() {
    return this.todoService.findAll();
  }

  @Query(() => Todo, { name: 'todo' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext
  ) {
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      const message = await i18n.translate('todo.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return todo;
  }

  @Mutation(() => Todo)
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Todo)
  async removeTodo(@Args('id', { type: () => Int }) id: number, @I18n() i18n: I18nContext,) {
    const todo = this.todoService.remove(id);
    if (!todo) {
      const message = await i18n.translate('todo.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return todo;
  }
}
