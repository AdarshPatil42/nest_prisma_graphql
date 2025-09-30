import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferResolver } from './offer.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [OfferResolver, OfferService, PrismaService],
})
export class OfferModule { }
