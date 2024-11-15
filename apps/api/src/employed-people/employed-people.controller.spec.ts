import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EmployedPeopleController } from './employed-people.controller';
import { EmployedPeopleService } from './employed-people.service';
import { EmployedPerson } from '../types';

describe('EmployedPeopleController', () => {
  let controller: EmployedPeopleController;
  let service: EmployedPeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployedPeopleController],
      providers: [
        {
          provide: EmployedPeopleService,
          useValue: { getEmployedPeople: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployedPeopleController>(EmployedPeopleController);
    service = module.get<EmployedPeopleService>(EmployedPeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getEmployedPeople', () => {
    it('should return a list of employed people', async () => {
      const result: EmployedPerson[] = [
        { name: 'John Doe', employedAt: 'Company A' },
        { name: 'Jane Smith', employedAt: 'Company B' },
      ];
      jest.spyOn(service, 'getEmployedPeople').mockResolvedValue(result);

      expect(await controller.getEmployedPeople()).toBe(result);
    });

    it('should call the service method', async () => {
      const serviceSpy = jest
        .spyOn(service, 'getEmployedPeople')
        .mockResolvedValue([]);

      await controller.getEmployedPeople();

      expect(serviceSpy).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      jest.spyOn(service, 'getEmployedPeople').mockResolvedValue([]);

      const result = await controller.getEmployedPeople();

      expect(result).toEqual([]);
    });

    it('should return sorted results from the service', async () => {
      const sortedResult: EmployedPerson[] = [
        { name: 'Jane Smith', employedAt: 'Company A' },
        { name: 'John Doe', employedAt: 'Company B' },
      ];
      jest.spyOn(service, 'getEmployedPeople').mockResolvedValue(sortedResult);

      const result = await controller.getEmployedPeople();

      expect(result).toEqual(sortedResult);
      expect(service.getEmployedPeople).toHaveBeenCalled();
    });
  });
});
