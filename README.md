# TypeScript CRM

A simple Customer Relationship Management (CRM) system built with TypeScript. The project focuses on type safety, object-oriented programming, generics, data validation, and automated testing.

It was developed as a practical learning project to apply TypeScript concepts in a structured application.

## Features

### Customer Management
- Add and retrieve customers.
- Validate customer data.
- Update customer information.
- Prevent invalid customer records.

### Product Management
- Add and retrieve products.
- Update product information.
- Validate product data.
- Increase and decrease product stock.
- Prevent invalid stock operations.

### Order Management
- Create orders for existing customers.
- Add multiple products to an order.
- Validate product availability and order quantities.
- Store original product prices in order items.
- Update order statuses.
- Cancel orders and restore product stock.
- Prevent stock changes when order creation fails.

## Technologies

- **TypeScript** – application logic and static typing.
- **Node.js** – JavaScript runtime.
- **tsx** – TypeScript execution and development workflow.
- **Vitest** – unit and integration testing.
- **@vitest/coverage-v8** – test coverage reporting.
- **npm** – package management.

## Project Structure

```text
src/
├── guards/
│   ├── customer-guard.ts
│   └── product-guard.ts
├── repositories/
│   └── repository.ts
├── services/
│   ├── customer-service.ts
│   ├── order-service.ts
│   └── product-service.ts
├── types/
│   ├── order.ts
│   ├── product.ts
│   └── user.ts
└── main.ts

tests/
├── guards/
├── integration/
├── repositories/
└── services/
```

## Architecture

The application is organized into several layers:

- **Guards** – validate `unknown` input and narrow types.
- **Types** – define application data structures and contracts.
- **Repositories** – provide generic in-memory data storage and basic data operations.
- **Services** – implement business logic, validation, and interactions between application entities.
- **Tests** – verify individual components and complete application workflows.

## Installation

Clone the repository:

```bash
git clone https://github.com/Szymon1th/mini-crm-ts.git
```

Navigate to the project directory:

```bash
cd mini-crm-ts
```

Install dependencies:

```bash
npm install
```

## Running the Application

Run the application:

```bash
npm start
```

Start the application in development mode with automatic restarts:

```bash
npm run dev
```

The application uses in-memory storage, so data is reset when the process is restarted.

## Type Checking

Check the project for TypeScript errors:

```bash
npm run typecheck
```

## Testing

Run the complete test suite:

```bash
npm test
```

Run tests once:

```bash
npx vitest run
```

Run tests in watch mode:

```bash
npx vitest
```

Generate a test coverage report:

```bash
npx vitest run --coverage
```

### Test Coverage

The project includes unit and integration tests.

**Unit tests** cover:
- Type guards.
- Generic repository operations.
- Customer, product, and order services.
- Input validation and error handling.
- Edge cases and boundary conditions.

**Integration tests** cover:
- Creating orders and decreasing product stock.
- Cancelling orders and restoring product stock.
- Handling failed order creation without modifying stock.

## Learning Objectives

The main goal of this project was to practice and understand:

- TypeScript basic and advanced types.
- Union types and type narrowing.
- `unknown` and custom type guards.
- Interfaces and type aliases.
- Generic classes and methods.
- Utility types such as `Partial` and `Omit`.
- Object-oriented programming and encapsulation.
- Separation of concerns.
- Unit and integration testing.

## Project Scope

This is an educational project focused on TypeScript fundamentals and application architecture. It uses an in-memory repository rather than a database, so data is not persisted between application runs.