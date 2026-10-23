import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import {
  getPizzaQuantityInCart,
  getQuantityByCartItemId,
} from "../cart/cartSlice";
import DeletePizza from "../cart/DeletePizza";
import UpdateQuantity from "../cart/UpdateQuantity";
import { useAddToCart } from "../cart/useAddToCart";
import FavoriteButton from "../favorites/FavoriteButton";
import PizzaTags from "./PizzaTags";
import {
  DEFAULT_SIZE,
  SIZES,
  calcUnitPrice,
  createCartItem,
  makeCartItemId,
} from "./pizzaOptions";

function MenuItem({ pizza }) {
  const addToCart = useAddToCart();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  // The card works with the chosen size without extras;
  // extras are added in the details modal.
  const [sizeId, setSizeId] = useState(DEFAULT_SIZE);
  const cartItemId = makeCartItemId(id, sizeId);
  const currentQuantity = useSelector(getQuantityByCartItemId(cartItemId));
  const otherQuantity =
    useSelector(getPizzaQuantityInCart(id)) - currentQuantity;
  const isInCart = currentQuantity > 0;
  console.log(currentQuantity);
  function handleAddToCart() {
    addToCart(createCartItem(pizza, { sizeId }));
  }
  return (
    // Phones: a grid - image and name side by side, the controls below them at full width.
    // From sm up: a vertical card (flex-col).
    <li
      className={`group relative grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-3 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 transition duration-300 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-yellow-400 sm:flex sm:flex-col sm:gap-3 ${
        soldOut ? "" : "hover:shadow-md motion-safe:hover:-translate-y-0.5"
      }`}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 sm:aspect-square sm:h-auto sm:w-full">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-300 ${
            soldOut ? "grayscale" : "motion-safe:group-hover:scale-105"
          }`}
        />
        {soldOut && (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-stone-800/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-stone-100 uppercase sm:top-2 sm:left-2 sm:px-2.5 sm:py-1 sm:text-xs">
            Sold out
          </span>
        )}
        {/* z-10 keeps it clickable above the card's stretched link */}
        <FavoriteButton
          pizzaId={id}
          pizzaName={name}
          className="absolute top-1.5 right-1.5 z-10 size-8 sm:top-2 sm:right-2 sm:size-9"
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* after:inset-0 stretches the link over the whole card */}
          <Link
            to={`/menu/${id}`}
            state={{ sizeId }}
            className="font-bold text-stone-800 after:absolute after:inset-0 focus:outline-none"
          >
            {name}
          </Link>
          <PizzaTags pizza={pizza} />
        </div>
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient}
              className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 capitalize"
            >
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-2 flex grow flex-col">
        {!soldOut && (
          <div className="relative z-10">
            {/* real radio inputs (visually hidden), so arrow keys work too */}
            <fieldset className="flex w-full rounded-full bg-stone-100 p-0.5">
              <legend className="sr-only">Size of {name}</legend>
              {SIZES.map((size) => (
                <label
                  key={size.id}
                  title={size.detail}
                  className="flex-1 cursor-pointer rounded-full px-2 py-1.5 text-center text-xs font-semibold text-stone-500 transition hover:text-stone-800 has-checked:bg-white has-checked:text-stone-800 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-stone-800"
                >
                  <input
                    type="radio"
                    name={`size-${id}`}
                    value={size.id}
                    checked={sizeId === size.id}
                    onChange={() => setSizeId(size.id)}
                    className="sr-only"
                  />
                  {size.label}
                </label>
              ))}
            </fieldset>
            <p className="mt-1.5 text-xs text-stone-500">
              <Link
                to={`/menu/${id}`}
                state={{ sizeId }}
                className="font-medium underline-offset-2 hover:text-stone-800 hover:underline"
              >
                + Add extras
              </Link>
              {otherQuantity > 0 && (
                <span className="whitespace-nowrap">
                  {" "}
                  &middot; {otherQuantity} more in cart
                </span>
              )}
            </p>
          </div>
        )}
        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p
            className={`font-semibold ${soldOut ? "text-stone-400" : "text-stone-800"}`}
          >
            {formatCurrency(calcUnitPrice(unitPrice, sizeId, []))}
          </p>
          {isInCart && (
            <div className="motion-safe:animate-pop-in flex items-center gap-2 sm:gap-3">
              <UpdateQuantity
                cartItemId={cartItemId}
                currentQuantity={currentQuantity}
              />
              <DeletePizza cartItemId={cartItemId} />
            </div>
          )}
          {!soldOut && !isInCart && (
            <Button onClick={handleAddToCart} type="small">
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
