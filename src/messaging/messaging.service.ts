import { KycStatus, TransferStatus } from '@fiatconnect/fiatconnect-types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class MessagingService {
  constructor(@Inject('IDENTITY_SERVICE') private readonly client: ClientKafka) {}

  public async publish(topic: string, msg: {}) {
    return this.client.emit(topic, { ...msg });
  }
}
