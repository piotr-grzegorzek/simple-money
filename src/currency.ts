// Currency class
export class Currency {
  constructor(
    public code: string,
    public precision: number,
    public symbol: string
  ) {}
}

// Factory class for creating currency objects
export abstract class CurrencyFactory {
  static USD(): Currency {
    return new Currency("USD", 2, "$");
  }
  static EUR(): Currency {
    return new Currency("EUR", 2, "€");
  }
  static JPY(): Currency {
    return new Currency("JPY", 0, "¥");
  }
  static GBP(): Currency {
    return new Currency("GBP", 2, "£");
  }
  static AUD(): Currency {
    return new Currency("AUD", 2, "$");
  }
  static CAD(): Currency {
    return new Currency("CAD", 2, "$");
  }
  static CNY(): Currency {
    return new Currency("CNY", 2, "¥");
  }
  static HKD(): Currency {
    return new Currency("HKD", 2, "$");
  }
  static NZD(): Currency {
    return new Currency("NZD", 2, "$");
  }
  static SEK(): Currency {
    return new Currency("SEK", 2, "kr");
  }
}
