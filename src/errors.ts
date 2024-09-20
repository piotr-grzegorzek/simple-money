// Custom error classes
export class InvalidAmountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAmountError";
  }
}

export class CurrencyMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CurrencyMismatchError";
  }
}
