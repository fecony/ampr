import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmployedPeopleService } from './employed-people.service';

describe('EmployedPeopleService', () => {
  let service: EmployedPeopleService;
  let cacheManager: Cache;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployedPeopleService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmployedPeopleService>(EmployedPeopleService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEmployedPeople', () => {
    it('should return cached data if available', async () => {
      const cachedData = [{ name: 'John Doe', employedAt: 'Company A' }];
      (cacheManager.get as jest.Mock).mockResolvedValue(cachedData);

      const result = await service.getEmployedPeople();

      expect(result).toEqual(cachedData);
      expect(cacheManager.get).toHaveBeenCalledWith('employed-people');
    });

    it('should generate and cache data if not cached', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);

      const result = await service.getEmployedPeople();

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'employed-people',
        result,
        60 * 60 * 1000,
      );
    });

    it('should return only employed people', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);

      const result = await service.getEmployedPeople();

      expect(result.every((person) => person.employedAt)).toBeTruthy();
    });

    it('should sort results by company name', async () => {
      (cacheManager.get as jest.Mock).mockResolvedValue(null);

      const result = await service.getEmployedPeople();

      expect(result).toEqual(
        result.sort((a, b) => a.employedAt.localeCompare(b.employedAt)),
      );
    });
  });

  describe('data generation', () => {
    it('should generate the correct number of companies', () => {
      expect(service['companies'].length).toBe(100);
    });

    it('should generate the correct number of people', () => {
      expect(service['people'].length).toBe(10_000);
    });

    it('should generate valid company data', () => {
      const company = service['companies'][0];

      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name');
      expect(typeof company.id).toBe('number');
      expect(typeof company.name).toBe('string');
    });

    it('should generate valid person data', () => {
      const person = service['people'][0];
      expect(person).toHaveProperty('id');
      expect(person).toHaveProperty('name');
      expect(person).toHaveProperty('employedAtId');
      expect(typeof person.id).toBe('number');
      expect(typeof person.name).toBe('string');
      expect(typeof person.employedAtId).toBe('number');
    });
  });
});
