import { Currency } from "./currency.js";
import { Money } from "./money.js";

const money1 = new Money("6", new Currency("crypto", 30, "c"));
const result = money1.dividedBy("999");

console.log(`${result}`);
