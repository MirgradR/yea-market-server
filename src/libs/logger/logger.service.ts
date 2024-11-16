import { Injectable } from '@nestjs/common';
import { CreateLogDto, FindLogsFilter } from './dto/logs.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LogsEntity } from './entity/logs.entity';
import { OrderType } from 'src/helpers/constants';
@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LogsEntity)
    private logRepository: Repository<LogsEntity>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = this.logRepository.create(log);
    await this.logRepository.save(newLog);
    return newLog;
  }

  async getLogs(query: FindLogsFilter) {
    const { order, level, method, orderBy, page = 1, take = 10 } = query;
    const where: any = {};

    if (level) {
      where.level = level;
    }
    if (method) {
      where.method = method;
    }

    const [logs, count] = await this.logRepository.findAndCount({
      where,
      order: {
        [orderBy]: order === OrderType.asc ? OrderType.asc : OrderType.desc,
      },
      take: take,
      skip: (page - 1) * take,
    });

    return { logs, count };
  }
}
