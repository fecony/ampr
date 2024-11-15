export interface Company {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  employedAtId: number | null;
}

export interface EmployedPerson {
  name: string;
  employedAt: string;
}
