export type IRate = {
  rateFrom: string,
  rateTo: string,
  rate: string,
  rateAddedBy: string,
};

export enum RateCurrencies {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}