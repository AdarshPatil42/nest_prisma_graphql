import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field()
  id: number;

  @Field()
  title: string;
}
