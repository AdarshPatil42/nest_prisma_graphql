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

  // -----------------------
  // Option 2: Separate translation table
  // -----------------------

  /**
   * Update content for a specific language (create or update translation)
   */
  async updateContentO2(id: number, lang: string, content: ContentDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    const existingTranslation = await this.prisma.todoTranslation.findUnique({
      where: {
        todoId_lang: { todoId: id, lang },
      },
    });

    // Convert ContentDto to a JSON-compatible object
    const contentJson = {
      title: content.title,
      summary: content.summary,
      details: content.details,
    };

    let updatedTranslation;
    if (existingTranslation) {
      updatedTranslation = await this.prisma.todoTranslation.update({
        where: { id: existingTranslation.id },
        data: { content: contentJson },
      });
    } else {
      updatedTranslation = await this.prisma.todoTranslation.create({
        data: {
          lang,
          content: contentJson,
          todoId: id,
        },
      });
    }

    return {
      ...todo,
      content: updatedTranslation.content as ContentDto,
    };
  }

  /**
   * Get all todos, returning content for requested lang
   */
  async findAllWithLangO2(i18n: I18nContext) {
    const lang = i18n.lang;
    const todos = await this.prisma.todo.findMany({
      include: {
        translations: {
          where: { lang },
        },
      },
    });

    return todos.map((todo) => ({
      ...todo,
      content: todo.translations.length > 0 ? todo.translations[0].content : null,
      translations: undefined,
    }));
  }

  /**
   * Get one todo, returning content for requested lang
   */
  async findOneWithLangO2(id: number, i18n: I18nContext) {
    const lang = i18n.lang;
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        translations: {
          where: { lang },
        },
      },
    });

    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    return {
      ...todo,
      content: todo.translations.length > 0 ? todo.translations[0].content : null,
      translations: undefined,
    };
  }

  // -----------------------
  // Option 3: Separate columns per language
  // -----------------------

  async updateContentO3(id: number, lang: string, content: ContentDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    const contentJson = {
      title: content.title,
      summary: content.summary,
      details: content.details,
    };

    const data: Record<string, any> = {};
    if (lang === 'en') data.content_en = contentJson;
    else if (lang === 'de') data.content_de = contentJson;
    else if (lang === 'es') data.content_es = contentJson;
    else throw new NotFoundException(`Unsupported language: ${lang}`);

    const updated = await this.prisma.todo.update({
      where: { id },
      data,
    });

    return { ...updated, content: contentJson as ContentDto };
  }

  async findAllWithLangO3(i18n: I18nContext) {
    const lang = i18n.lang;
    const field = lang === 'en' ? 'content_en' : lang === 'de' ? 'content_de' : lang === 'es' ? 'content_es' : null;
    if (!field) return await this.prisma.todo.findMany({ select: { id: true, title: true, createdAt: true, updatedAt: true } });

    return await this.prisma.todo.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        [field]: true,
      },
    }).then((todos) =>
      todos.map((todo) => ({
        ...todo,
        content: todo[field] || null,
      })),
    );
  }

  async findOneWithLangO3(id: number, i18n: I18nContext) {
    const lang = i18n.lang;
    const field = lang === 'en' ? 'content_en' : lang === 'de' ? 'content_de' : lang === 'es' ? 'content_es' : null;
    if (!field) throw new NotFoundException(`Unsupported language: ${lang}`);

    const todo = await this.prisma.todo.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        [field]: true,
      },
    });

    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    return { ...todo, content: todo[field] || null };
  }
}