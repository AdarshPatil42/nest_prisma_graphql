
import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CustomUserResolver implements I18nResolver {
  async resolve(context: ExecutionContext): Promise<string | string[] | undefined> {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    // depending on your auth, user might be in gqlCtx.req.user or gqlCtx.user
    const user = gqlCtx.req?.user ?? gqlCtx.user;
    return user?.preferredLocale; // e.g. 'de' or 'en-US'
  }
}
