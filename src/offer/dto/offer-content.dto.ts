import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('OfferContentInput')
export class OfferContentDto {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    test: string;
}