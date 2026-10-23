import { Suspense, useState } from "react";
import { Await, Outlet, useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import MenuItem from "./MenuItem";
import MenuSkeleton from "./MenuSkeleton";
import { FILTERS } from "./pizzaFilters";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Lowest price" },
  { value: "price-desc", label: "Highest price" },
];

function matchesSearch(pizza, searchTerm) {
  if (!searchTerm) return true;
  return (
    pizza.name.toLowerCase().includes(searchTerm) ||
    pizza.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm),
    )
  );
}

function comparePrice(a, b, sortBy) {
  if (sortBy === "price-asc") return a.unitPrice - b.unitPrice;
  if (sortBy === "price-desc") return b.unitPrice - a.unitPrice;
  return 0;
}

function Menu() {
  const { menu } = useLoaderData();

  return (
    <Suspense fallback={<MenuSkeleton />}>
      <Await resolve={menu}>{(menu) => <MenuContent menu={menu} />}</Await>
    </Suspense>
  );
}

function MenuContent({ menu }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  const searchTerm = query.trim().toLowerCase();
  const { test } = FILTERS.find((filter) => filter.value === activeFilter);
  const pizzas = menu
    .filter(test)
    .filter((pizza) => matchesSearch(pizza, searchTerm))
    // sold out pizzas always go to the end
    .sort(
      (a, b) =>
        Number(a.soldOut) - Number(b.soldOut) || comparePrice(a, b, sortBy),
    );

  function clearFilters() {
    setQuery("");
    setActiveFilter("all");
  }

  return (
    <>
      <div className="sticky top-0 z-20 space-y-3 bg-stone-100/90 px-4 py-3 backdrop-blur">
        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pizzas"
            aria-label="Search pizza or ingredient"
            className="input w-full min-w-0 bg-white"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort pizzas"
            className="input shrink-0 cursor-pointer bg-white"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2" role="group" aria-label="Filter pizzas">
          {FILTERS.map(({ value, label, test }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              aria-pressed={activeFilter === value}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition focus:ring focus:ring-yellow-400 focus:outline-none ${
                activeFilter === value
                  ? "bg-stone-800 text-stone-50"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-200"
              }`}
            >
              {label}{" "}
              <span className="opacity-60">{menu.filter(test).length}</span>
            </button>
          ))}
        </div>
      </div>

      {pizzas.length > 0 ? (
        <ul className="grid gap-4 px-4 pt-3 pb-6 sm:grid-cols-2 md:grid-cols-3">
          {pizzas.map((pizza) => (
            <MenuItem pizza={pizza} key={pizza.id} />
          ))}
        </ul>
      ) : (
        <div className="px-4 py-16 text-center">
          <p className="font-semibold text-stone-800">No pizzas found</p>
          <p className="mt-1 mb-5 text-sm text-stone-500">
            Try a different search or filter.
          </p>
          <Button type="small" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      <Outlet />
    </>
  );
}

// The promise is returned without await, so the page renders right away
// with a skeleton, and <Await> fills it in when the menu arrives.
export function loader() {
  return { menu: getMenu() };
}

export default Menu;
