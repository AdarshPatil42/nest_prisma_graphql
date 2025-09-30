import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { I18nContext } from 'nestjs-i18n';
import { OfferContentDto } from './dto/offer-content.dto';

@Injectable()
export class OfferService {
  constructor(private readonly prisma: PrismaService) { }

  private validateSingleForeignKey(entity: { offerId?: number }) {
    const ids = [entity.offerId].filter(id => id !== undefined);
    if (ids.length !== 1) {
      throw new BadRequestException('Exactly one parent ID must be provided');
    }
  }

  async create(name: string, planId: number | null, lang: string, content?: OfferContentDto) {
    let translationData;
    if (content) {
      translationData = {
        lang,
        content: {
          title: content.title,
          description: content.description,
        },
      };
    }

    const offer = await this.prisma.offer.create({
      data: {
        name,
        planId,
        translations: content ? { create: translationData } : undefined,
      },
      select: {
        id: true,
        name: true,
        planId: true,
        createdAt: true,
        updatedAt: true,
        translations: content ? { where: { lang }, select: { content: true } } : false,
      },
    });

    if (content) {
      this.validateSingleForeignKey({ offerId: offer.id });
    }

    return {
      ...offer,
      content: offer.translations?.[0]?.content || null,
    };
  }

  async updateContent(id: number, lang: string, content: OfferContentDto) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) throw new NotFoundException(`Offer with id ${id} not found`);

    this.validateSingleForeignKey({ offerId: id });

    const existingTranslation = await this.prisma.entityTranslation.findUnique({
      where: {
        offerId_lang: { offerId: id, lang },
      },
    });

    const contentJson = {
      title: content.title,
      description: content.description,
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
          offerId: id,
        },
      });
    }

    return {
      ...offer,
      content: updatedTranslation.content as OfferContentDto,
    };
  }

  async findAllWithLang(i18n: I18nContext) {
    const lang = i18n.lang;
    return await this.prisma.offer.findMany({
      select: {
        id: true,
        name: true,
        planId: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          select: { content: true },
          where: { lang },
          take: 1,
        },
      },
    }).then((offers) =>
      offers.map((offer) => ({
        ...offer,
        content: offer.translations[0]?.content || null,
      })),
    );
  }

  async findOneWithLang(id: number, i18n: I18nContext) {
    const lang = i18n.lang;
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        planId: true,
        createdAt: true,
        updatedAt: true,
        translations: {
          select: { content: true },
          where: { lang },
          take: 1,
        },
      },
    });

    if (!offer) throw new NotFoundException(`Offer with id ${id} not found`);

    return {
      ...offer,
      content: offer.translations[0]?.content || null,
    };
  }
}