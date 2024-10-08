import { Currency } from "./currency.js";
import { CurrencyMismatchError, InvalidAmountError } from "./errors.js";
import BigNumber from "bignumber.js";

// Enum for deciding whether to append zeroes to money amount
export enum ToFixed {
  YES,
  NO,
}

// Enum for deciding whether to round input money amount
export enum RoundNow {
  YES,
  NO,
}

// Money class
export class Money {
  currency: Currency;
  private amount: BigNumber;

  constructor(
    amount: number | string | BigNumber,
    currency: Currency,
    roundNow: RoundNow = RoundNow.YES,
    roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
  ) {
    this.amount = new BigNumber(amount);

    // Ensure the amount is a valid number and not NaN/Infinity
    if (!this.amount.isFinite()) {
      throw new InvalidAmountError(
        `Invalid amount: ${amount} is not a valid numeric value.`
      );
    }

    // Round the amount if needed
    if (roundNow === RoundNow.YES) {
      this.amount = this.amount.decimalPlaces(currency.precision, roundingMode);
    }

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
  plus(other: Money): Money {
    this.checkCurrency(other);
    const result = this.amount.plus(other.amount);
    return new Money(result, this.currency, RoundNow.NO);
  }

  // Subtraction
  minus(other: Money): Money {
    this.checkCurrency(other);
    const result = this.amount.minus(other.amount);
    return new Money(result, this.currency, RoundNow.NO);
  }

  // Multiplication
  times(
    multiplier: number | string,
    roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
  ): Money {
    const result = this.amount
      .times(multiplier)
      .decimalPlaces(this.currency.precision, roundingMode);
    return new Money(result, this.currency, RoundNow.NO);
  }

  // Division
  dividedBy(
    divisor: number | string,
    roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
  ): Money {
    const result = this.performWithSettings(
      () => this.amount.dividedBy(divisor),
      roundingMode,
      this.currency.precision
    );
    return new Money(result, this.currency, RoundNow.NO);
  }

  // Is greater
  gt(other: Money): boolean {
    this.checkCurrency(other);
    return this.amount.gt(other.amount);
  }

  // Is greater or equal
  gte(other: Money): boolean {
    this.checkCurrency(other);
    return this.amount.gte(other.amount);
  }

  // Is less
  lt(other: Money): boolean {
    this.checkCurrency(other);
    return this.amount.lt(other.amount);
  }

  // Is less or equal
  lte(other: Money): boolean {
    this.checkCurrency(other);
    return this.amount.lte(other.amount);
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
