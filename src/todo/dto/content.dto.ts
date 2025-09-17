import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
@InputType('ContentInput')
export class ContentDto {
    @Field()
    title: string;

    @Field()
    summary?: string;

    @Field()
    details?: string;
}
