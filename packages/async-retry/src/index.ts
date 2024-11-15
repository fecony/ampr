import { RetryError } from "./errors";

export async function retry<T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 5
): Promise<T | undefined> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw new RetryError(
          `Failed after ${maxRetries} attempts`,
          attempt,
          lastError
        );
      }
    }
  }
}
