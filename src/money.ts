import { Currency } from "./currency.js";
import { CurrencyMismatchError, InvalidAmountError } from "./errors.js";
import BigNumber from "bignumber.js";

// Enum for deciding whether to append zeroes to money amount
export enum ToFixed {
  YES,
  NO,
}

// Money class
export class Money {
  currency: Currency;
  private amount: BigNumber;

  constructor(amount: string | BigNumber, currency: Currency) {
    this.amount = new BigNumber(amount);

    // Ensure the amount is a valid number and not NaN/Infinity
    if (!this.amount.isFinite()) {
      throw new InvalidAmountError(
        `Invalid amount: ${amount} is not a valid numeric value.`
      );
    }

    this.amount = this.amount.decimalPlaces(currency.precision);
    this.currency = currency;
  }

  toString(toFixed = ToFixed.YES): string {
    const amount =
      toFixed === ToFixed.YES
        ? this.amount.toFixed(this.currency.precision)
        : this.amount.toString();
    return `${this.currency.symbol}${amount}`;
  }

  // Addition
  add(other: Money): Money {
    this.checkCurrency(other);
    const result = this.amount.plus(other.amount);
    return new Money(result, this.currency);
  }

  // Subtraction
  subtract(other: Money): Money {
    this.checkCurrency(other);
    const result = this.amount.minus(other.amount);
    return new Money(result, this.currency);
  }

  // Multiplication
  multiply(
    multiplier: string,
    roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
  ): Money {
    const result = this.amount
      .times(multiplier)
      .decimalPlaces(this.currency.precision, roundingMode);
    return new Money(result, this.currency);
  }

  // Division
  divide(
    divisor: string,
    roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
  ): Money {
    const result = this.performWithSettings(
      () => this.amount.dividedBy(divisor),
      roundingMode,
      this.currency.precision
    );
    return new Money(result, this.currency);
  }

  // Ensure the two money objects have the same currency
  private checkCurrency(other: Money) {
    if (this.currency.code !== other.currency.code) {
      throw new CurrencyMismatchError(
        `Currency mismatch: Cannot operate on different currencies - ${this.currency.code} and ${other.currency.code}`
      );
    }
  }

  // Method ensuring that provided method is perfomed with choosen global settings
  // Operations we should handle this way are : division, square root and base conversion operations, and power operations with negative exponents.
  private performWithSettings(
    operation: () => BigNumber,
    roundingMode: BigNumber.RoundingMode,
    roundingPrecision: number
  ): BigNumber {
    const originalMode = BigNumber.config().ROUNDING_MODE;
    const originalPrecision = BigNumber.config().DECIMAL_PLACES;

    BigNumber.config({
      ROUNDING_MODE: roundingMode,
      DECIMAL_PLACES: roundingPrecision,
    });

    const result = operation();

    BigNumber.config({
      ROUNDING_MODE: originalMode,
      DECIMAL_PLACES: originalPrecision,
    });

    return result;
  }
}
