import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { EmployedPeopleService } from './employed-people.service';
import type { EmployedPerson } from '../types';

@Controller('employed-people')
export class EmployedPeopleController {
  constructor(private readonly employedPeopleService: EmployedPeopleService) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  getEmployedPeople(): Promise<EmployedPerson[]> {
    return this.employedPeopleService.getEmployedPeople();
  }
}
