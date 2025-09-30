import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nContext } from 'nestjs-i18n';
import { CreditContentDto } from './dto/credit-content.dto';

@Injectable()
export class CreditService {
  constructor(private readonly prisma: PrismaService) { }

  private validateSingleForeignKey(entity: { creditId?: number }) {
    const ids = [entity.creditId].filter(id => id !== undefined);
    if (ids.length !== 1) {
      throw new BadRequestException('Exactly one parent ID must be provided');
    }
  }

  async create(amount: number, userId: number, lang: string, content?: CreditContentDto) {
    let translationData;
    if (content) {
      translationData = {
        lang,
        content: {
          description: content.description,
          amount: content.amount,
        },
      };
    }

    const credit = await this.prisma.credit.create({
      data: {
        amount,
        userId,
        translations: content ? { create: translationData } : undefined,
      },
      select: {
        id: true,
        amount: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        translations: content ? { where: { lang }, select: { content: true } } : false,
      },
    });

    if (content) {
      this.validateSingleForeignKey({ creditId: credit.id });
    }

    return {
      ...credit,
      content: credit.translations?.[0]?.content || null,
    };
  }

  async updateContent(id: number, lang: string, content: CreditContentDto) {
    const credit = await this.prisma.credit.findUnique({ where: { id } });
    if (!credit) throw new NotFoundException(`Credit with id ${id} not found`);

    this.validateSingleForeignKey({ creditId: id });

    const existingTranslation = await this.prisma.entityTranslation.findUnique({
      where: {
        creditId_lang: { creditId: id, lang },
      },
    });

    const contentJson = {
      description: content.description,
      amount: content.amount,
    };

    let updatedTranslation;
    if (existingTranslation) {
      updatedTranslation = await this.prisma.entityTranslation.update({
        where: { id: existingTranslation.id },
        data: { content: contentJson },
      });
    } else {
      updatedTranslation = await this.prisma.entityTranslation.create({
        data: {
          lang,
          content: contentJson,
          creditId: id,
        },
      });
    }

    return {
      ...credit,
      content: updatedTranslation.content as CreditContentDto,
    };
  }

  async findAllWithLang(i18n: I18nContext) {
    const lang = i18n.lang;
    return await this.prisma.credit.findMany({
      select: {
        id: true,
        amount: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          select: { content: true },
          where: { lang },
          take: 1,
        },
      },
    }).then((credits) =>
      credits.map((credit) => ({
        ...credit,
        content: credit.translations[0]?.content || null,
      })),
    );
  }

  async findOneWithLang(id: number, i18n: I18nContext) {
    const lang = i18n.lang;
    const credit = await this.prisma.credit.findUnique({
      where: { id },
      select: {
        id: true,
        amount: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          select: { content: true },
          where: { lang },
          take: 1,
        },
      },
    });

    if (!credit) throw new NotFoundException(`Credit with id ${id} not found`);

    return {
      ...credit,
      content: credit.translations[0]?.content || null,
    };
  }
}