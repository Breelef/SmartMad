import Calculator from './calculator';

const calculatorTestData = () => [
  ['add', 1, 2, 3],
  ['subtract', 5, 3, 2],
  ['multiply', 4, 3, 12],
  ['divide', 10, 2, 5]
];


const factorialTestData = () => [
  [5, 120],
  [0, 1], 
];

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });


  test.each(calculatorTestData())('calculates %s of %d and %d', (operation, num1, num2, expected) => {
    expect(calculator.calculate(operation, num1, num2)).toBe(expected);
  });

  test('throws error when dividing by zero', () => {
    expect(() => calculator.divide(10, 0)).toThrow("Division by zero");
  });

  test.each(calculatorTestData())('calculates %s operation using switch case for %d and %d', (operation, num1, num2, expected) => {
    expect(calculator.calculate(operation, num1, num2)).toBe(expected);
  });


  test('throws error for invalid operation', () => {
    expect(() => calculator.calculate('invalid', 1, 2)).toThrow("Invalid operation");
  });


  test.each(factorialTestData())('calculates factorial of %d', (number, expected) => {
    expect(calculator.factorial(number)).toBe(expected);
  });


  test('throws error for factorial of negative number', () => {
    expect(() => calculator.factorial(-1)).toThrow("Factorial of negative number");
  });
});
