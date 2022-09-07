import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { LoggerModule } from '../logger/logger.module';
import { MessagingService } from '../messaging/messaging.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [MessagingModule, LoggerModule],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
