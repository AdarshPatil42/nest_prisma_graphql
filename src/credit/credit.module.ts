import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { CreditResolver } from './credit.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CreditResolver, CreditService, PrismaService],
})
export class CreditModule { }
