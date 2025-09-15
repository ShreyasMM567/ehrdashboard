# Test Suite

This directory contains the test suite for the EHR Dashboard application.

## Structure

- `unit/` - Unit tests for individual functions, components, and hooks
- `integration/` - Integration tests for API routes and component interactions
- `__mocks__/` - Mock files for testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Files

### Unit Tests
- `utils.test.ts` - Tests for utility functions (formatting, class merging, etc.)
- `Button.test.tsx` - Tests for the Button component
- `usePatients.test.ts` - Tests for the usePatients hook

### Integration Tests
- `api.test.ts` - Tests for API route handlers

## Writing Tests

When adding new tests:

1. **Unit tests** should test individual functions, components, or hooks in isolation
2. **Integration tests** should test how different parts of the application work together
3. Use descriptive test names that explain what is being tested
4. Follow the AAA pattern: Arrange, Act, Assert
5. Mock external dependencies appropriately

## Example Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something specific', () => {
    // Arrange
    const props = { ... }
    
    // Act
    const result = someFunction(props)
    
    // Assert
    expect(result).toBe(expectedValue)
  })
})
```
