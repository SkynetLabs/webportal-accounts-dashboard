export const localizeMoney = (amount, currency = "USD") => {
  const formatter = new Intl.NumberFormat(undefined, { style: "currency", currency });

  return formatter.format(amount);
};
