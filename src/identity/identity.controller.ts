import { KycStatus } from '@fiatconnect/fiatconnect-types';
import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { KycCreatedDto } from './dto/kyc-created-event.dto';
import { IdentityService } from './identity.service';
import { verifyExpiringDate, isValidDocumentType, validateAge, checkAML, checkPEP } from './utils';

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern('identity.created')
  handleCreatedEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    return this.identityService.handleCreatedEvent(context);
  }

  @MessagePattern('identity.updated')
  handleUpdatedEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    return this.identityService.handleUpdatedEvent(context);
  }
}
