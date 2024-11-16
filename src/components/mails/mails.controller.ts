import { Body, Controller, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ContactUsDto } from './dto/contactUs.dto';
import { ContactUsOperation } from './decorators/contactUsOperation.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('contact-us')
@Controller('contact-us')
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Post()
  @ContactUsOperation()
  async contactUs(@Body() dto: ContactUsDto) {
    return await this.mailsService.contactUs(dto);
  }
}
