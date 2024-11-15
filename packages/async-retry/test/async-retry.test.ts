import { retry } from "../src";
import { RetryError } from "../src/errors";

describe("withRetry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return result on successful execution", async () => {
    const asyncFn = jest.fn().mockResolvedValueOnce("success");

    const result = await retry(() => asyncFn());

    expect(result).toBe("success");
    expect(asyncFn).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure, then succeed", async () => {
    const asyncFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockRejectedValueOnce(new Error("fail 2"))
      .mockResolvedValueOnce("success");

    const result = await retry(() => asyncFn());

    expect(result).toBe("success");
    expect(asyncFn).toHaveBeenCalledTimes(3);
  });

  it("should throw RetryError after max retries", async () => {
    const asyncFn = jest.fn().mockRejectedValue(new Error("always fails"));

    await expect(retry(asyncFn, 3)).rejects.toThrow(RetryError);
    expect(asyncFn).toHaveBeenCalledTimes(3);

    try {
      await retry(asyncFn, 3);
    } catch (error) {
      expect(error).toBeInstanceOf(RetryError);
      expect(error.message).toBe("Failed after 3 attempts");
      expect((error as RetryError).attempts).toBe(3);
      expect((error as RetryError).lastError.message).toBe("always fails");
    }

    expect(asyncFn).toHaveBeenCalledTimes(6);
  });

  it("should retry 5 times if maxRetries is not provided", async () => {
    const asyncFn = jest.fn().mockRejectedValue(new Error("fail"));

    await expect(retry(asyncFn)).rejects.toThrow(RetryError);

    expect(asyncFn).toHaveBeenCalledTimes(5);
  });

  it("should handle non-Error rejections", async () => {
    const asyncFn = jest.fn().mockRejectedValue("non-Error rejection");

    await expect(retry(asyncFn, 3)).rejects.toThrow(RetryError);
    expect(asyncFn).toHaveBeenCalledTimes(3);

    try {
      await retry(asyncFn, 3);
    } catch (error) {
      expect(error).toBeInstanceOf(RetryError);
      expect((error as RetryError).lastError).toBe("non-Error rejection");
    }

    expect(asyncFn).toHaveBeenCalledTimes(6);
  });
});
