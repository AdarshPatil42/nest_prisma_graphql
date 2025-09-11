// src/common/filters/gql-i18n-exception.filter.ts
import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter, GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { I18nService } from 'nestjs-i18n';
import { DomainError } from '../errors/domain-error';
import { mapPrismaError } from '../errors/prisma-mapper';

@Catch()
export class GqlI18nExceptionFilter implements GqlExceptionFilter {
  constructor(private readonly i18n: I18nService) { }

  async catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlExecutionContext.create(host as any);
    const ctx = gqlHost.getContext();
    const lang = ctx?.req?.headers?.['accept-language'] || ctx?.locale || 'en';

    let domainErr: DomainError | null = null;

    if (exception instanceof DomainError) {
      domainErr = exception;
    } else {
      domainErr = mapPrismaError(exception);
    }

    // if (!domainErr) {
    //   domainErr = new DomainError(
    //     'INTERNAL_ERROR',
    //     'errors.unexpected',
    //     {},
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }

    if (exception instanceof DomainError) {
      domainErr = exception;
    } else {
      // Map known Prisma errors
      domainErr = mapPrismaError(exception);

      // If not Prisma and not DomainError → rethrow
      if (!domainErr) {
        throw exception; // Let Nest handle it
      }
    }

    // Force cast because translate<T> returns Promise<T | unknown>
    const message = (await this.i18n.translate(domainErr.i18nKey, {
      lang,
      args: domainErr.args,
    })) as string;

    const status = domainErr.httpStatus ?? HttpStatus.BAD_REQUEST;

    return new GraphQLError(message, {
      extensions: {
        code: domainErr.code,
        i18nKey: domainErr.i18nKey,
        args: domainErr.args,
        httpStatus: status,
      },
    });
  }
}
