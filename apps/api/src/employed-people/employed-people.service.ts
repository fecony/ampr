import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { faker } from '@faker-js/faker';
import { Company, Person, EmployedPerson } from '../types';

@Injectable()
export class EmployedPeopleService {
  private readonly companies: Company[];
  private readonly people: Person[];

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.companies = this.generateCompanies(100);
    this.people = this.generatePeople(10_000);
  }

  private generateCompanies(count: number): Company[] {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: faker.company.name(),
    }));
  }

  private generatePeople(count: number): Person[] {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: faker.person.fullName(),
      employedAtId:
        Math.random() < 0.8
          ? faker.number.int({ min: 1, max: this.companies.length })
          : null,
    }));
  }

  async getEmployedPeople(): Promise<EmployedPerson[]> {
    const cachedData =
      await this.cacheManager.get<EmployedPerson[]>('employed-people');

    if (cachedData) return cachedData;

    const employedPeople = this.people.filter(
      (person) => person.employedAtId !== null,
    );

    // NOTE: store for lookup
    const companyMap = new Map<number, string>(
      this.companies.map((company) => [company.id, company.name]),
    );

    // NOTE: map to EmployedPerson type and sort by company name
    const data = employedPeople
      .map((person) => ({
        name: person.name,
        employedAt: companyMap.get(person.employedAtId) || 'Unknown Company',
      }))
      .sort((a, b) => a.employedAt.localeCompare(b.employedAt));

    await this.cacheManager.set('employed-people', data, 60 * 60 * 1000);

    return data;
  }
}
