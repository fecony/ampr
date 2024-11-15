import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployedPeopleController } from './employed-people/employed-people.controller';
import { EmployedPeopleService } from './employed-people/employed-people.service';
import { AppLoggerMiddleware } from './app-logger/app-logger.middleware';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000,
    }),
  ],
  controllers: [AppController, EmployedPeopleController],
  providers: [AppService, EmployedPeopleService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    // NOTE: middleware to see response time
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
