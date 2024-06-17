import { Injectable } from '@nestjs/common';
import { CreateLogDto, FindLogsFilter } from './dto/logs.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoggerService {
  constructor(private prismaService: PrismaService) {}

  async createLog(log: CreateLogDto) {
    const newLog = this.prismaService.logs.create({
      data: {
        context: log.context,
        host: log.host,
        message: log.message,
        level: log.level,
        method: log.method,
        // statusCode: log.statusCode,
        time: log.time,
        url: log.url,
        user: log.user,
      },
    });
    return newLog;
  }

  async getLogs(query: FindLogsFilter) {
    const { order, level, method, orderBy, page = 1, take = 10 } = query;
    const where: Prisma.LogsWhereInput = {};

    if (query.level) {
      where.level = query.level;
    }
    if (query.method) {
      where.method = query.method;
    }

    const [logs, count] = await this.prismaService.logs.findMany({
      where,
      orderBy: {
        [orderBy]: order,
      },
      take: take,
      skip: (page - 1) * take,
    });

    return { logs, count: count };
  }
}
