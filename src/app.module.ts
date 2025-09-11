import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TodoModule } from './todo/todo.module';
import { PrismaService } from './prisma/prisma.service';
import * as path from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TodoModule,
  ],
  providers: [PrismaService],
})
export class AppModule {
  constructor() {
    // 👇 this runs when the module is loaded
    // console.log('📂 i18n looking in:', path.join(process.cwd(), 'src', 'i18n'));
    // console.log('📂 i18n looking in:q1111111111', path.join(__dirname, 'i18n'));
  }
}
