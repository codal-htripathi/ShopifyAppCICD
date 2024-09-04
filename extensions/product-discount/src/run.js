import { DiscountApplicationStrategy } from "../generated/api";

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input) {
  const discounts = [];

  input.cart.lines.forEach((line) => {
    let discountValue = 0;
    let minimumQuantity = 0;

    if (line.quantity >= 50) {
      discountValue = 7.5;
      minimumQuantity = 50;
    } else if (line.quantity >= 25) {
      discountValue = 5;
      minimumQuantity = 25;
    } else if (line.quantity >= 10) {
      discountValue = 2.5;
      minimumQuantity = 10;
    }

    if (discountValue > 0) {
      discounts.push({
        targets: [
          {
            cartLine: {
              id: line.id,
              quantity: line.quantity,
            },
          },
        ],
        value: {
          percentage: {
            value: discountValue,
          },
        },
        message: `${discountValue}% OFF BUYING AT LEAST ${minimumQuantity}`,
      });
    }
  });

  if (discounts.length === 0) {
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.All,
  };
}

