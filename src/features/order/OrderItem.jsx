import { Suspense } from "react";
import { Await } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";

// menuPromise comes from fetcher.load("/menu"); the menu loader returns { menu: Promise }
function OrderItem({ item, menuPromise }) {
  const { pizzaId, quantity, name, totalPrice, addIngredients = [] } = item;

  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p>
          <span className="font-bold">{quantity}&times;</span> {name}
        </p>
        <p className="font-bold">{formatCurrency(totalPrice)}</p>
      </div>
      {addIngredients.length > 0 && (
        <p className="text-sm text-stone-600">+ {addIngredients.join(", ")}</p>
      )}
      <p className="text-sm text-stone-500 capitalize italic">
        {menuPromise ? (
          <Suspense fallback="Loading...">
            <Await resolve={menuPromise}>
              {(menu) =>
                menu
                  .find((pizza) => pizza.id === pizzaId)
                  ?.ingredients.join(", ")
              }
            </Await>
          </Suspense>
        ) : (
          "Loading..."
        )}
      </p>
    </li>
  );
}

export default OrderItem;
