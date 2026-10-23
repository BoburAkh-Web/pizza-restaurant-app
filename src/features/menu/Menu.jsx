import { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { Await, Outlet, useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { getFavoriteIds } from "../favorites/favoritesSlice";
import ActiveOrders from "../order/ActiveOrders";
import MenuItem from "./MenuItem";
import MenuSkeleton from "./MenuSkeleton";
import { FILTERS, SORT_OPTIONS } from "./pizzaFilters";

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
    // relative: on wide screens ActiveOrders is positioned to the left of this box
    <div className="relative">
      <ActiveOrders />
      <Suspense fallback={<MenuSkeleton />}>
        <Await resolve={menu}>{(menu) => <MenuContent menu={menu} />}</Await>
      </Suspense>
    </div>
  );
}

function MenuContent({ menu }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const favoriteIds = useSelector(getFavoriteIds);

  const searchTerm = query.trim().toLowerCase();
  // the favorites filter depends on Redux state, so it's added here, not in pizzaFilters.js
  const filters = [
    ...FILTERS,
    {
      value: "favorites",
      label: "♥ Favorites",
      test: (pizza) => favoriteIds.includes(pizza.id),
    },
  ].map((filter) => ({ ...filter, count: menu.filter(filter.test).length }));
  const { test } = filters.find((filter) => filter.value === activeFilter);
  const isFavoritesEmpty =
    activeFilter === "favorites" && favoriteIds.length === 0;
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
      <div className="sticky top-0 z-20 bg-stone-100/90 px-4 py-3 backdrop-blur">
        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pizzas"
            aria-label="Search pizza or ingredient"
            className="input w-full min-w-0 bg-white"
          />
          {/* Phones: the select shrinks to an icon (its text is transparent), so the search
              field keeps its room. Tapping it still opens the phone's native picker. */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort pizzas"
              className="input h-full w-12 cursor-pointer appearance-none bg-white px-0 text-transparent sm:w-auto sm:appearance-auto sm:px-4 sm:text-stone-700 md:px-6"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value} className="text-stone-700">
                  {label}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 stroke-stone-600 sm:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
              />
            </svg>
            {/* shows that a non-default sorting is active */}
            {sortBy !== "recommended" && (
              <span className="pointer-events-none absolute top-1.5 right-1.5 size-2.5 rounded-full bg-yellow-400 ring-2 ring-white sm:hidden" />
            )}
          </div>
        </div>

        {/* scrolls sideways on phones, where the chips don't fit in one row */}
        <div
          className="-mx-4 mt-2 flex scrollbar-none gap-2 overflow-x-auto px-4 py-1"
          role="group"
          aria-label="Filter pizzas"
        >
          {filters.map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              aria-pressed={activeFilter === value}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition focus:outline-none focus-visible:ring focus-visible:ring-yellow-400 ${
                activeFilter === value
                  ? "bg-stone-800 text-stone-50"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-200"
              }`}
            >
              {label} <span className="opacity-60">{count}</span>
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
          <p className="font-semibold text-stone-800">
            {isFavoritesEmpty ? "No favorites yet" : "No pizzas found"}
          </p>
          <p className="mt-1 mb-5 text-sm text-stone-500">
            {isFavoritesEmpty
              ? "Tap the ♥ on a pizza to save it here."
              : "Try a different search or filter."}
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
