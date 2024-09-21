import { Currencies } from "./currency.js";
import { Money } from "./money.js";

const money2 = new Money("7", Currencies.EUR());
const money3 = new Money("6", Currencies.EUR());
const money4 = new Money("8", Currencies.EUR());

console.log(money2.gt(money3));
console.log(money2.gte(money3));
console.log(money2.lt(money4));
console.log(money3.lte(money3));
