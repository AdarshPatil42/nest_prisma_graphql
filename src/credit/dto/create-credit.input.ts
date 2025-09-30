import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCreditInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
