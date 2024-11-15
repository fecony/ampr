import { Fruit, FruitProbability } from "./types";

export class FruitMachine {
  private readonly fruits: FruitProbability[] = [
    { fruit: "apple", probability: 0.5 },
    { fruit: "pear", probability: 0.2 },
    { fruit: "orange", probability: 0.15 },
    { fruit: "peach", probability: 0.1 },
    { fruit: "mango", probability: 0.05 },
  ];

  public *[Symbol.iterator](): Generator<Fruit> {
    while (true) {
      let cumulativeProbability = 0;

      const random = Math.random();

      for (const { fruit, probability } of this.fruits) {
        cumulativeProbability += probability;

        if (random < cumulativeProbability) {
          yield fruit;
          break;
        }
      }
    }
  }

  public dispense(): Fruit {
    const iterator = this[Symbol.iterator]();
    return iterator.next().value;
  }

  public dispenseFruits(amount: number): Fruit[] {
    return Array.from({ length: amount }, () => this.dispense());
  }
}
