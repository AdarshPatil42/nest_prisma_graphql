import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OfferService } from './offer.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { OfferContentDto } from './dto/offer-content.dto';

@Resolver(() => Offer)
export class OfferResolver {
  constructor(private readonly offerService: OfferService) { }

  @Mutation(() => Offer)
  createOffer(
    @Args('name') name: string,
    @Args('planId', { type: () => Int, nullable: true }) planId: number | null,
    @Args('lang') lang: string,
    @Args('content', { type: () => OfferContentDto, nullable: true }) content?: OfferContentDto,
  ) {
    return this.offerService.create(name, planId, lang, content);
  }

  @Mutation(() => Offer)
  updateOfferContent(
    @Args('id', { type: () => Int }) id: number,
    @Args('lang') lang: string,
    @Args('content', { type: () => OfferContentDto }) content: OfferContentDto,
  ) {
    return this.offerService.updateContent(id, lang, content);
  }

  @Query(() => [Offer], { name: 'offersWithLang' })
  findAllWithLang(@I18n() i18n: I18nContext) {
    return this.offerService.findAllWithLang(i18n);
  }

  @Query(() => Offer, { name: 'offerWithLang' })
  async findOneWithLang(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext,
  ) {
    const offer = await this.offerService.findOneWithLang(id, i18n);
    if (!offer) {
      const message = i18n.translate('offer.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return offer;
  }
}