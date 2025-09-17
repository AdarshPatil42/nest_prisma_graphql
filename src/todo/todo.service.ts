import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentDto } from './dto/content.dto';
import { I18nContext } from 'nestjs-i18n';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createTodoInput: CreateTodoInput) {
    return await this.prisma.todo.create({
      data: { title: createTodoInput.title },
    });
  }

  async findAll() {
    return await this.prisma.todo.findMany();
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  update(id: number, updateTodoInput: UpdateTodoInput) {
    return this.prisma.todo.update({
      where: { id },
      data: { title: updateTodoInput.title },
    });
  }

  remove(id: number) {
    return this.prisma.todo.delete({ where: { id } });
  }

  // -----------------------
  // Option 1: JSON with language keys
  // -----------------------

  /**
   * Update content for a specific language
   */
  async updateContentO1(
    id: number,
    lang: string,
    content: ContentDto,
  ) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    const existingContent =
      (todo.content as Prisma.JsonObject) || {};

    existingContent[lang] = { ...content };

    const updated = await this.prisma.todo.update({
      where: { id },
      data: { content: existingContent },
    });

    return {
      ...updated,
      content: updated.content
        ? (updated.content as any)[lang] as ContentDto
        : null,
    };
  }

  /**
   * Get all todos, returning content for requested lang
   */
  async findAllWithLangO1(i18n: I18nContext) {
    const lang = i18n.lang;
    console.log(lang);
    const todos = await this.prisma.todo.findMany();

    return todos.map((todo) => ({
      ...todo,
      content: todo.content ? todo.content[lang] : null,
    }));
  }

  /**
   * Get one todo, returning content for requested lang
   */
  async findOneWithLangO1(id: number, i18n: I18nContext) {
    const lang = i18n.lang;
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    return {
      ...todo,
      content: todo.content ? todo.content[lang] : null,
    };
  }
}
