import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IDENTITY_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'identity',
            brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'identity-consumer',
          },
        },
      },
    ]),
    MessagingModule,
  ],
  providers: [MessagingService, MessagingController],
  controllers: [MessagingController],
  exports: [MessagingService],
})
export class MessagingModule {}
