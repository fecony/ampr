import { FruitMachine } from "../src";
import { Fruit } from "../src/types";

describe("FruitMachine", () => {
  const ITERATIONS = 100_000;
  let fruitMachine: FruitMachine;
  const validFruits: Fruit[] = ["apple", "pear", "orange", "peach", "mango"];

  beforeEach(() => {
    fruitMachine = new FruitMachine();
  });

  it("should return a valid fruit", () => {
    const result = fruitMachine.dispense();
    expect(validFruits).toContain(result);
  });

  describe("dispenseFruits", () => {
    it("should return the correct number of fruits", () => {
      const amount = 10;
      const fruits = fruitMachine.dispenseFruits(amount);
      expect(fruits).toHaveLength(amount);
    });

    it("should return an empty array when amount is 0", () => {
      const fruits = fruitMachine.dispenseFruits(0);
      expect(fruits).toHaveLength(0);
    });

    it("should return valid fruits", () => {
      const fruits = fruitMachine.dispenseFruits(10);
      fruits.forEach((fruit) => {
        expect(validFruits).toContain(fruit);
      });
    });
  });

  it("should return fruits with ± correct probabilities", () => {
    const counts: Record<Fruit, number> = {
      apple: 0,
      pear: 0,
      orange: 0,
      peach: 0,
      mango: 0,
    };

    const fruits = fruitMachine.dispenseFruits(ITERATIONS);
    fruits.forEach((fruit) => counts[fruit]++);

    const errorMargin = 0.01;

    const actualProbabilities: Record<Fruit, number> = {
      apple: counts.apple / ITERATIONS,
      pear: counts.pear / ITERATIONS,
      orange: counts.orange / ITERATIONS,
      peach: counts.peach / ITERATIONS,
      mango: counts.mango / ITERATIONS,
    };

    const expectedProbabilities: Record<Fruit, number> = {
      apple: 0.5,
      pear: 0.2,
      orange: 0.15,
      peach: 0.1,
      mango: 0.05,
    };

    Object.keys(expectedProbabilities).forEach((fruit) => {
      const actual = actualProbabilities[fruit as Fruit];
      const expected = expectedProbabilities[fruit as Fruit];

      expect(actual).toBeCloseTo(expected, 2);
      expect(Math.abs(actual - expected)).toBeLessThan(errorMargin);
    });
  });

  describe("iterator", () => {
    it("should be able to iterate and generate valid fruits", () => {
      const iterator = fruitMachine[Symbol.iterator]();

      for (let i = 0; i < 10; i++) {
        const { value } = iterator.next();
        expect(validFruits).toContain(value);
      }
    });

    it("should allow for custom iteration using for...of", () => {
      let count = 0;
      const fruits: Fruit[] = [];

      for (const fruit of fruitMachine) {
        fruits.push(fruit);
        count++;
        if (count >= 5) break;
      }

      expect(fruits).toHaveLength(5);
      fruits.forEach((fruit) => {
        expect(["apple", "pear", "orange", "peach", "mango"]).toContain(fruit);
      });
    });

    it("should generate an infinite sequence", () => {
      const iterator = fruitMachine[Symbol.iterator]();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const { done } = iterator.next();
        expect(done).toBe(false);
      }
    });
  });
});
