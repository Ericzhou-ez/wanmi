import { formatPrice } from "lib/format-price";

const Price = ({
  amount,
  className,
  currencyCode,
  ...props
}: {
  amount: string | number;
  className?: string;
  currencyCode?: string;
} & React.ComponentProps<"p">) => (
  <p suppressHydrationWarning={true} className={className} {...props}>
    {formatPrice(amount, currencyCode)}
  </p>
);

export default Price;
