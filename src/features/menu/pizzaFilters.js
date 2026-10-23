// The API has no categories, so tags are derived from the ingredients.
const MEAT_AND_FISH = [
  "ham",
  "prosciutto",
  "salami",
  "pepperoni",
  "chicken",
  "anchovies",
];
const SPICY = ["chili", "spicy", "pepperoncini"];

function hasIngredient(pizza, keywords) {
  return pizza.ingredients.some((ingredient) =>
    keywords.some((keyword) => ingredient.toLowerCase().includes(keyword)),
  );
}

export const isVegetarian = (pizza) => !hasIngredient(pizza, MEAT_AND_FISH);
export const isSpicy = (pizza) => hasIngredient(pizza, SPICY);

export const FILTERS = [
  { value: "all", label: "All", test: () => true },
  { value: "vegetarian", label: "Vegetarian", test: isVegetarian },
  { value: "spicy", label: "Spicy", test: isSpicy },
];

export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Lowest price" },
  { value: "price-desc", label: "Highest price" },
];
