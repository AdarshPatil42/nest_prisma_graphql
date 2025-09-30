import { ObjectType, Field, InputType, Float } from '@nestjs/graphql';

@ObjectType()
@InputType('CreditContentInput')
export class CreditContentDto {
    @Field()
    description: string;

    @Field(() => Float)
    amount: number;
}