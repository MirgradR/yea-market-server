import { Injectable, Logger } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    private readonly redisRepository: RedisRepository,
    private configService: ConfigService,
  ) {}

  tenMinutesInSeconds = this.configService.get('REDIS_ACCESS_TOKEN_TIME');

  async setTokenWithExpiry(key: string, token: string): Promise<void> {
    this.logger.log(`Setting token ${token} with expiry for key: ${key}`);
    await this.redisRepository.setWithExpiry(
      'accessToken',
      key,
      token,
      +this.tenMinutesInSeconds,
    );
    this.logger.log(`Token ${token} set with expiry for key: ${key}`);
  }

  async getRedisToken(token: string) {
    this.logger.log(`Getting token from Redis: ${token}`);
    const retrievedToken = await this.redisRepository.get('accessToken', token);
    this.logger.log(`Token ${token} retrieved from Redis`);
    return retrievedToken;
  }

  async setUserStatus(
    userId: string,
    socketId: string,
    isActive: boolean,
  ): Promise<void> {
    const userKey = `user:${userId}`;
    const userStatus = {
      socketId,
      isActive,
    };
    await this.redisRepository.set(
      'socketStatus',
      userKey,
      JSON.stringify(userStatus),
    );
    this.logger.log(`User status set for user ${userId}`);
  }

  async deleteUserStatus(userId: string): Promise<void> {
    const userKey = `user:${userId}`;
    await this.redisRepository.delete('socketStatus', userKey);
    this.logger.log(`User status deleted for user ${userId}`);
  }

  async getUserStatus(userId: string) {
    this.logger.log(`Getting user from Redis: ${userId}`);
    const user = await this.redisRepository.get(
      'socketStatus',
      `user:${userId}`,
    );
    this.logger.log(`userId ${userId} retrieved from Redis`);
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }

  async saveOfflineMessage(userId: string, message: any): Promise<void> {
    const messages = (await this.getOfflineMessages(userId)) || [];
    messages.push(message);
    await this.redisRepository.set(
      `offlineMessages:${userId}`,
      `offlineMessages:${userId}`,
      JSON.stringify(messages),
    );
  }

  async getOfflineMessages(userId: string): Promise<any[]> {
    const data = await this.redisRepository.get(
      `offlineMessages:${userId}`,
      `offlineMessages:${userId}`,
    );
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  async clearOfflineMessages(userId: string): Promise<void> {
    await this.redisRepository.delete(
      `offlineMessages:${userId}`,
      `offlineMessages:${userId}`,
    );
  }

  async deleteAllSocketStatuses(): Promise<void> {
    this.logger.log(`Deleting all socket statuses`);
    const keys = await this.redisRepository.keys('socketStatus:*');
    await Promise.all(
      keys.map((key) => this.redisRepository.delete('socketStatus', key)),
    );
    this.logger.log(`All socket statuses deleted`);
  }
}
