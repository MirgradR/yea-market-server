import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';

export function ContactUsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Contact us' }),
    ApiOkResponse({ description: 'Mail sent to us' }),
    Public(),
  );
}
