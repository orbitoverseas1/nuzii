export const getDiscountAmount = (
  price: number | undefined,
  discount: number | undefined
) => Math.min(price ?? 0, Math.max(discount ?? 0, 0));

export const getDiscountedPrice = (
  price: number | undefined,
  discount: number | undefined
) => Math.max((price ?? 0) - getDiscountAmount(price, discount), 0);

