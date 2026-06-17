import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter";
import { getDiscountedPrice } from "@/lib/productPricing";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  const hasDiscount = Boolean(price && discount);
  const discountedPrice = getDiscountedPrice(price, discount);

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <PriceFormatter
          amount={hasDiscount ? discountedPrice : price}
          className={className}
        />
        {hasDiscount && (
          <PriceFormatter
            amount={price}
            className={twMerge(
              "line-through text-xs font-medium text-zinc-500",
              className
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;
