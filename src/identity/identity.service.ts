import { KycStatus } from '@fiatconnect/fiatconnect-types';
import { Injectable, Logger } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from '../logger/logger.service';
import { MessagingService } from '../messaging/messaging.service';
import { KycCreatedDto } from './dto/kyc-created-event.dto';
import { KycUpdatedDto } from './dto/kyc-updated-event.dto';
import { verifyExpiringDate, isValidDocumentType, validateAge, checkAML, checkPEP } from './utils';

@Injectable()
export class IdentityService {
  constructor(
    private readonly logger: LoggerService = new Logger(IdentityService.name),
    private readonly messagingService: MessagingService,
  ) {}

  async handleCreatedEvent(context: KafkaContext) {
    const originalMessage = context.getMessage();
    const obj = JSON.parse(JSON.stringify(originalMessage.value)) as KycCreatedDto;
    const userFullname = obj.firstName + ' ' + obj.lastName;

    // Validate Day of Birth
    const formatedDate = `${obj.dateOfBirth.month}-${obj.dateOfBirth.day}-${obj.dateOfBirth.year}`;
    const formattedDayOfBirth = new Date(formatedDate);

    const isExpiredDocument = verifyExpiringDate(obj.expires_At);
    const isSupportedDocument = isValidDocumentType('NATIONAL_ID_CARD');
    const isNotUnderAge = validateAge(formattedDayOfBirth);
    const hasPassedAMLCheck = checkAML(userFullname, formattedDayOfBirth);
    const hasPassedPEPCheck = checkPEP(userFullname, formattedDayOfBirth);
    if (!isSupportedDocument || !isNotUnderAge) {
      obj.status = KycStatus.KycDenied;
      await this.messagingService.publish('identity.denied', obj);
    }
    if (!isExpiredDocument) {
      obj.status = KycStatus.KycExpired;
      await this.messagingService.publish('identity.expired', obj);
    }
    if (!hasPassedAMLCheck || !hasPassedPEPCheck) {
      obj.status = KycStatus.KycDenied;

      await this.messagingService.publish('identity.rejected', obj);
    }
    // approve status
    obj.status = KycStatus.KycApproved;
    await this.messagingService.publish('identity.approved', obj);

    return obj;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    this.logger.debug('Called when the current minutes is 10');
  }

  handleUpdatedEvent(context: KafkaContext) {
    const originalMessage = context.getMessage();
    const obj = JSON.parse(JSON.stringify(originalMessage.value)) as KycUpdatedDto;

    return obj;
  }
}
