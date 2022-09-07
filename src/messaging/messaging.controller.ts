import { Controller, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller('messaging')
export class MessagingController implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('IDENTITY_SERVICE') private readonly client: ClientKafka) {}
  async onModuleInit() {
    ['identity.created', 'identity.updated'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
}
