class Calculator {
    add(a, b) {
      return a + b;
    }
  
    subtract(a, b) {
      return a - b;
    }
  
    multiply(a, b) {
      return a * b;
    }
  
    divide(a, b) {
      if (b === 0) {
        throw new Error("Division by zero");
      }
      return a / b;
    }
  
    calculate(operation, a, b) {
      switch (operation) {
        case 'add':
          return this.add(a, b);
        case 'subtract':
          return this.subtract(a, b);
        case 'multiply':
          return this.multiply(a, b);
        case 'divide':
          return this.divide(a, b);
        default:
          throw new Error("Invalid operation");
      }
    }
  
    factorial(n) {
      if (n < 0) {
        throw new Error("Factorial of negative number");
      }
      let result = 1;
      for (let i = 1; i <= n; i++) {
        result *= i;
      }
      return result;
    }
  }

export default Calculator;