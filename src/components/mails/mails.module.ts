import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailsController } from './mails.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [MailsService],
  controllers: [MailsController],
  exports: [MailsService],
})
export class MailsModule {}
