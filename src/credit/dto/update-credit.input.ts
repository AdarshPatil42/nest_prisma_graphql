import { CreateCreditInput } from './create-credit.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCreditInput extends PartialType(CreateCreditInput) {
  @Field(() => Int)
  id: number;
}
