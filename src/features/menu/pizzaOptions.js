import { formatCurrency } from "../../utils/helpers";

export const SIZES = [
  { id: "S", label: "Small", detail: "25 cm", priceChange: -2 },
  { id: "M", label: "Medium", detail: "30 cm", priceChange: 0 },
  { id: "L", label: "Large", detail: "35 cm", priceChange: 3 },
];
export const DEFAULT_SIZE = "M";

export const EXTRAS = [
  { id: "cheese", label: "Extra cheese", price: 1.5 },
  { id: "mushrooms", label: "Mushrooms", price: 1 },
  { id: "olives", label: "Olives", price: 1 },
  { id: "jalapenos", label: "Jalapeños", price: 1 },
  { id: "arugula", label: "Arugula", price: 1 },
];

const getSize = (sizeId) => SIZES.find((size) => size.id === sizeId);

// Always returns extras in the EXTRAS order, so the same choice always gives the same cartItemId
const getExtras = (extraIds) =>
  EXTRAS.filter((extra) => extraIds.includes(extra.id));

export function formatPriceChange(amount) {
  return `${amount < 0 ? "−" : "+"}${formatCurrency(Math.abs(amount))}`;
}

export function calcUnitPrice(basePrice, sizeId, extraIds) {
  const extrasPrice = getExtras(extraIds).reduce(
    (sum, extra) => sum + extra.price,
    0,
  );
  return basePrice + getSize(sizeId).priceChange + extrasPrice;
}

// Same pizza + size + extras -> same id, so adding it again only increases the quantity
export function makeCartItemId(pizzaId, sizeId, extraIds = []) {
  const extras = getExtras(extraIds).map((extra) => extra.id);
  return [pizzaId, sizeId, ...extras].join("-");
}

export function createCartItem(
  pizza,
  { sizeId = DEFAULT_SIZE, extraIds = [], quantity = 1 } = {},
) {
  const extras = getExtras(extraIds).map((extra) => extra.id);
  const unitPrice = calcUnitPrice(pizza.unitPrice, sizeId, extras);

  return {
    cartItemId: makeCartItemId(pizza.id, sizeId, extras),
    pizzaId: pizza.id,
    name: pizza.name,
    size: sizeId,
    extras,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
  };
}

// "Large · Extra cheese · Olives"; empty for a plain Medium pizza
export function describeOptions({ size, extras }) {
  if (size === DEFAULT_SIZE && extras.length === 0) return "";
  return [
    getSize(size).label,
    ...getExtras(extras).map((extra) => extra.label),
  ].join(" · ");
}

// The API drops unknown fields: it has no size field, so the size goes into
// the name, and the extras go into its addIngredients field.
export function toOrderItem({
  pizzaId,
  name,
  size,
  extras,
  quantity,
  unitPrice,
  totalPrice,
}) {
  return {
    pizzaId,
    name: size === DEFAULT_SIZE ? name : `${name} (${getSize(size).label})`,
    quantity,
    unitPrice,
    totalPrice,
    addIngredients: getExtras(extras).map((extra) => extra.label),
  };
}
