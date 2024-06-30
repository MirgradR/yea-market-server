import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactUsDto } from './dto/contactUs.dto';

@Injectable()
export class MailsService {
  private readonly logger = new Logger(MailsService.name);

  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async contactUs(dto: ContactUsDto) {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      this.logger.log('In development mode, skipping email sending.');
      return { message: 'Mail send successfully!' };
    }
    await this.mailerService.sendMail({
      to: this.configService.getOrThrow('SMTP_USER'),
      from: this.configService.getOrThrow('SMTP_USER'),
      subject: 'Request information',
      html: `
        <div>
        <p>${dto.name}</p>
        <p>${dto.company}</p>
        <p>${dto.phone}</p>
        <p>${dto.email}</p>
        <p>${dto.message}</p>
        </div>
      `,
    });

    this.logger.log('Email sent successfully!');
    return { message: 'Mail send successfully!' };
  }
}
