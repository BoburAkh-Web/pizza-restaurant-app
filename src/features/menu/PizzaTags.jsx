import { isSpicy, isVegetarian } from "./pizzaFilters";

const tagStyle =
  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase";

function PizzaTags({ pizza }) {
  const vegetarian = isVegetarian(pizza);
  const spicy = isSpicy(pizza);
  if (!vegetarian && !spicy) return null;

  return (
    <span className="inline-flex gap-1">
      {vegetarian && (
        <span className={`${tagStyle} bg-green-100 text-green-700`}>Veg</span>
      )}
      {spicy && (
        <span className={`${tagStyle} bg-red-100 text-red-700`}>Spicy</span>
      )}
    </span>
  );
}

export default PizzaTags;
