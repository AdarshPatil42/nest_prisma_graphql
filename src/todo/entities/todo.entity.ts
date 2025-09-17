import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ContentDto } from '../dto/content.dto';

@ObjectType()
export class Todo {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  updatedAt: Date;

  // Option 1: JSON with language keys
  @Field(() => ContentDto, { nullable: true })
  content?: ContentDto;

  // Option 3: Separate columns per language
  @Field(() => ContentDto, { nullable: true })
  content_en?: ContentDto;

  @Field(() => ContentDto, { nullable: true })
  content_de?: ContentDto;

  @Field(() => ContentDto, { nullable: true })
  content_es?: ContentDto;

  // Option 2: Translation table
  @Field(() => [TodoTranslation], { nullable: true })
  translations?: TodoTranslation[];
}

@ObjectType()
export class TodoTranslation {
  @Field(() => Int)
  id: number;

  @Field()
  lang: string;

  @Field(() => ContentDto)
  content: ContentDto;
}
