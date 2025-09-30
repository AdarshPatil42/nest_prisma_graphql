import { CreateOfferInput } from './create-offer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOfferInput extends PartialType(CreateOfferInput) {
  @Field(() => Int)
  id: number;
}
