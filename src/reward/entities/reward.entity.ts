import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Reward {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
