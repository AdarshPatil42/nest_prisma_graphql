import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { CreditService } from './credit.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';
import { Credit } from './entities/credit.entity';
import { CreditContentDto } from './dto/credit-content.dto';

@Resolver(() => Credit)
export class CreditResolver {
  constructor(private readonly creditService: CreditService) { }

  @Mutation(() => Credit)
  createCredit(
    @Args('amount', { type: () => Float }) amount: number,
    @Args('userId', { type: () => Int }) userId: number,
    @Args('lang') lang: string,
    @Args('content', { type: () => CreditContentDto, nullable: true }) content?: CreditContentDto,
  ) {
    return this.creditService.create(amount, userId, lang, content);
  }

  @Mutation(() => Credit)
  updateCreditContent(
    @Args('id', { type: () => Int }) id: number,
    @Args('lang') lang: string,
    @Args('content', { type: () => CreditContentDto }) content: CreditContentDto,
  ) {
    return this.creditService.updateContent(id, lang, content);
  }

  @Query(() => [Credit], { name: 'creditsWithLang' })
  findAllWithLang(@I18n() i18n: I18nContext) {
    return this.creditService.findAllWithLang(i18n);
  }

  @Query(() => Credit, { name: 'creditWithLang' })
  async findOneWithLang(
    @Args('id', { type: () => Int }) id: number,
    @I18n() i18n: I18nContext,
  ) {
    const credit = await this.creditService.findOneWithLang(id, i18n);
    if (!credit) {
      const message = i18n.translate('credit.not_found', { args: { id } });
      throw new NotFoundException(message);
    }
    return credit;
  }
}