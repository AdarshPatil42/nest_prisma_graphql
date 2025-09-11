import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { I18nContext, I18nService } from 'nestjs-i18n';
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

  // @Query(() => Todo, { name: 'todo' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.todoService.findOne(id);
  // }

  @Query(() => Todo, { name: 'todo' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ) {
    const i18n = I18nContext.current();
    console.log('Resolved lang:', i18n?.lang);
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      const message = i18n!.translate('todo.not_found', { args: { id } });
      console.log('message', message);
      throw new NotFoundException(message);
    }
    return todo;
  }

  @Mutation(() => Todo)
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.remove(id);
  }
}
