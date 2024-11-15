import { AppLoggerMiddleware } from './app-logger.middleware';

describe('AppLoggerMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new AppLoggerMiddleware()).toBeDefined();
  });
});
