import { Currencies } from "./currency.js";
import { Money } from "./money.js";

const { EUR } = Currencies;

const money2 = new Money("7", EUR());
const money3 = new Money(6, EUR());
const money4 = new Money(8.115, EUR());

console.log(money2.gt(money3));
console.log(money2.gte(money3));
console.log(money2.lt(money4));
console.log(money3.lte(money3));
