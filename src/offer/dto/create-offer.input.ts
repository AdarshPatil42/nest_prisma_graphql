import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOfferInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
