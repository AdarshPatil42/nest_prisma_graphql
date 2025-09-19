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

  // ------------------------------
  // 🚀 Option 2: Separate translation table
  // ------------------------------

  // 🔹 Update content for specific lang
  @Mutation(() => Todo)
  updateTodoContentO2(
    @Args('id', { type: () => Int }) id: number,
    @Args('lang') lang: string,
    @Args('content') content: ContentDto,
  ) {
    return this.todoService.updateContentO2(id, lang, content);
  }

  // 🔹 Get all todos in request language
  @Query(() => [Todo], { name: 'todosWithLangO2' })
  findAllWithLangO2(@I18n() i18n: I18nContext) {
    return this.todoService.findAllWithLangO2(i18n);
  }

  // 🔹 Get one todo in request language
  @Query(() => Todo, { name: 'todoWithLangO2' })
  async findOneWithLangO2(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext,
  ) {
    const todo = await this.todoService.findOneWithLangO2(id, i18n);
    if (!todo) {
      const message = i18n.translate('todo.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return todo;
  }


  // ------------------------------
  // 🚀 Option 3: Separate columns per language
  // ------------------------------

  @Mutation(() => Todo)
  updateTodoContentO3(
    @Args('id', { type: () => Int }) id: number,
    @Args('lang') lang: string,
    @Args('content') content: ContentDto,
  ) {
    return this.todoService.updateContentO3(id, lang, content);
  }

  @Query(() => [Todo], { name: 'todosWithLangO3' })
  findAllWithLangO3(@I18n() i18n: I18nContext) {
    return this.todoService.findAllWithLangO3(i18n);
  }

  @Query(() => Todo, { name: 'todoWithLangO3' })
  async findOneWithLangO3(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext,
  ) {
    const todo = await this.todoService.findOneWithLangO3(id, i18n);
    if (!todo) {
      const message = i18n.translate('todo.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return todo;
  }
}
