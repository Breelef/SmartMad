import Calculator from './calculator';

describe('Calculator', () => {
    let calculator;
  
    beforeEach(() => {
      calculator = new Calculator();
    });
  
    test('adds two numbers', () => {
      expect(calculator.add(1, 2)).toBe(3);
    });
  
    test('subtracts two numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });
  
    test('multiplies two numbers', () => {
      expect(calculator.multiply(4, 3)).toBe(12);
    });
  
    test('divides two numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });
  
    test('throws error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow("Division by zero");
    });
  
    test('calculates using switch case for add', () => {
      expect(calculator.calculate('add', 1, 2)).toBe(3);
    });
  
    test('calculates using switch case for subtract', () => {
      expect(calculator.calculate('subtract', 5, 3)).toBe(2);
    });
  
    test('calculates using switch case for multiply', () => {
      expect(calculator.calculate('multiply', 4, 3)).toBe(12);
    });
  
    test('calculates using switch case for divide', () => {
      expect(calculator.calculate('divide', 10, 2)).toBe(5);
    });
  
    test('throws error for invalid operation', () => {
      expect(() => calculator.calculate('invalid', 1, 2)).toThrow("Invalid operation");
    });
  
    test('calculates factorial of a number', () => {
      expect(calculator.factorial(5)).toBe(120);
    });
  
    test('throws error for factorial of negative number', () => {
      expect(() => calculator.factorial(-1)).toThrow("Factorial of negative number");
    });
  });