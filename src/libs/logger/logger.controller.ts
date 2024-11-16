import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { FindLogsFilter } from './dto/logs.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/isPublic.decorator';

@ApiTags('logs')
@Controller('/root/logs')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  @Public()
  @ApiOkResponse({
    status: 200,
    description: 'Logs returned successfully',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ status: 401, description: 'User unauthorized' })
  getLogs(@Query() query: FindLogsFilter) {
    return this.loggerService.getLogs(query);
  }
}
