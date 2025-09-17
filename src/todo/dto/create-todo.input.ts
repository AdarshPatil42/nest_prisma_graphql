import { InputType, Int, Field } from '@nestjs/graphql';
import { ContentDto } from './content.dto';

@InputType()
export class CreateTodoInput {
  @Field()
  title: string;

  // Option 1: JSON with language keys → you can wrap ContentDto[]
  @Field(() => ContentDto, { nullable: true })
  content?: ContentDto;

  // Option 3: Separate columns
  @Field(() => ContentDto, { nullable: true })
  content_en?: ContentDto;

  @Field(() => ContentDto, { nullable: true })
  content_de?: ContentDto;

  @Field(() => ContentDto, { nullable: true })
  content_es?: ContentDto;
}
