import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { I18n, I18nContext } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';
import { ContentDto } from './dto/content.dto';

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
    @I18n() i18n: I18nContext,
  ) {
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      const message = i18n.translate('todo.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return todo;
  }

  @Mutation(() => Todo)
  async updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return await this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Todo)
  async removeTodo(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext,
  ) {
    const todo = await this.todoService.remove(id);
    if (!todo) {
      const message = i18n.translate('todo.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return todo;
  }

  // ------------------------------
  // 🚀 Option 1: JSON with language keys
  // ------------------------------

  // 🔹 Update content for specific lang
  @Mutation(() => Todo)
  updateTodoContentO1(
    @Args('id', { type: () => Int }) id: number,
    @Args('lang') lang: string,
    @Args('content') content: ContentDto,
  ) {
    return this.todoService.updateContentO1(id, lang, content);
  }

  // 🔹 Get all todos in request language
  @Query(() => [Todo], { name: 'todosWithLang' })
  findAllWithLangO1(@I18n() i18n: I18nContext) {
    return this.todoService.findAllWithLangO1(i18n);
  }

  // 🔹 Get one todo in request language
  @Query(() => Todo, { name: 'todoWithLang' })
  findOneWithLangO1(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext,
  ) {
    return this.todoService.findOneWithLangO1(id, i18n);
  }
}
