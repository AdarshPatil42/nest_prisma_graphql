import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { CreditContentDto } from '../dto/credit-content.dto';

@ObjectType()
export class Credit {
  @Field(() => Int)
  id: number;

  @Field(() => Float)
  amount: number;

  @Field(() => Int)
  userId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => CreditContentDto, { nullable: true })
  content?: CreditContentDto;
}