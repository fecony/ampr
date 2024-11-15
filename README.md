# AMPR

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed ([node v20+](https://nodejs.org/en)).
- [Git](https://git-scm.com/) installed.

### Getting Started

Clone the project

```bash
git clone git@github.com:fecony/ampr.git
```

Go to the project directory

```bash
cd ampr
```

Install dependencies

```bash
npm install
```

### Task Overview

**Task 1 Code Location:**

- File: packages/fruit-machine/src/index.ts
- Unit Test File: packages/fruit-machine/test/fruit-machine.test.ts

**Task 2 Code Location:**

- File: packages/async-retry/src/index.ts
- Unit Test File: packages/async-retry/test/async-retry.test.ts

**Task 3 Code Location:**

- Files:
  - apps/api/src/employed-people/employed-people.controller.ts
  - apps/api/src/employed-people/employed-people.service.ts
- Unit Test Files:
  - apps/api/src/employed-people/employed-people.controller.spec.ts
  - apps/api/src/employed-people/employed-people.service.spec.ts

### Running Nest.js app

```bash
npm run dev
```

### Running Tests with Turbo

This guide explains how to run tests using Turbo, a tool for managing monorepos. You can run all tests or filter to run specific tests.

#### Running All Tests

To run all tests in your project, use the following command:

```bash
npm run test
```

#### Running Specific Tests

To run tests for a specific package, use the following command:

Fruit Machine Tests

```bash
npm run test:fruit-machine
```

Async Retry Tests

```bash
npm run test:async-retry
```

API Tests

```bash
npm run test:api
```
