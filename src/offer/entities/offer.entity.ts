import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OfferContentDto } from '../dto/offer-content.dto';

@ObjectType()
export class Offer {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  planId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => OfferContentDto, { nullable: true })
  content?: OfferContentDto;
}