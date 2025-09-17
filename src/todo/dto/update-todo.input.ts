import { ContentDto } from './content.dto';
import { CreateTodoInput } from './create-todo.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @Field()
  id: number;

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
