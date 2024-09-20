# SimpleMoney

SimpleMoney is a TypeScript library for handling monetary values with high precision and various currency support. It leverages the decimal.js library to ensure accurate arithmetic operations and rounding.

## Features

High precision arithmetic operations (up to 20 decimal places)
Rounding to the nearest neighbor
Support for multiple currencies, with easy ability to add more

## Example

```typescript
import { Money, Currency } from "./money.js";

const invoice1 = new Money(0.3, Currency.USD());
const invoice2 = new Money(0.2, Currency.USD());
const total = invoice1.minus(invoice2);
console.log(
  `Correct decimal(decimal.js): ${invoice1.Amount} ${invoice1.Currency} - ${invoice2.Amount} ${invoice2.Currency} = ${total}`
);

const badinvoice1 = invoice1.Amount.toNumber();
const badinvoice2 = invoice2.Amount.toNumber();
const badtotal = badinvoice1 - badinvoice2;
console.log(
  `Incorrect decimal(IEEE 754): ${badinvoice1} ${invoice1.Currency} - ${badinvoice2} ${invoice2.Currency} = ${badtotal}`
);
```
