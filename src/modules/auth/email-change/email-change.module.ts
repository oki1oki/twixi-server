import { Module } from '@nestjs/common';
import { EmailChangeService } from './email-change.service';
import { EmailChangeResolver } from './email-change.resolver';

@Module({
  providers: [EmailChangeResolver, EmailChangeService],
})
export class EmailChangeModule {}
