import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  useAsyncValue,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { getPizzaQuantityInCart } from "../cart/cartSlice";
import { useAddToCart } from "../cart/useAddToCart";
import FavoriteButton from "../favorites/FavoriteButton";
import PizzaTags from "./PizzaTags";
import {
  DEFAULT_SIZE,
  EXTRAS,
  SIZES,
  calcUnitPrice,
  createCartItem,
  formatPriceChange,
} from "./pizzaOptions";

const headingStyle =
  "text-xs font-semibold tracking-wide text-stone-400 uppercase";
// The real radio/checkbox inputs are visually hidden; the label is styled from their state
const optionStyle =
  "cursor-pointer ring-1 ring-stone-200 transition hover:bg-stone-50 has-checked:bg-yellow-100 has-checked:ring-2 has-checked:ring-yellow-400 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-stone-800";
// must match duration-200 in the closing classes of the dialog
const CLOSE_ANIMATION_MS = 200;

function PizzaDetails() {
  const { pizzaId } = useParams();
  // PizzaDetails renders inside Menu's <Await>, so the resolved menu is available here
  const menu = useAsyncValue();
  const pizza = menu.find((pizza) => pizza.id === Number(pizzaId));
  const quantityInCart = useSelector(getPizzaQuantityInCart(Number(pizzaId)));
  const location = useLocation();
  // the menu card passes its selected size in the link state
  const cardSize = location.state?.sizeId;
  const [sizeId, setSizeId] = useState(
    SIZES.some((size) => size.id === cardSize) ? cardSize : DEFAULT_SIZE,
  );
  const [extraIds, setExtraIds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const dialogRef = useRef(null);
  const addToCart = useAddToCart();
  const navigate = useNavigate();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  if (!pizza) return <Navigate to="/menu" replace />;
  const { name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const itemPrice = calcUnitPrice(unitPrice, sizeId, extraIds);

  // Opened from the menu -> go back in history, so the browser Back button stays consistent.
  // Opened directly from a link -> there is nothing to go back to, so replace with /menu.
  function handleClose() {
    if (location.key !== "default") navigate(-1);
    else navigate("/menu", { replace: true });
  }

  // Plays the exit transition first, then really closes the dialog (which fires onClose -> handleClose).
  // If the user leaves with the Back button meanwhile, the dialog is already gone, hence the ?.
  function closeDialog() {
    if (closeTimerRef.current) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      dialogRef.current.close();
      return;
    }
    setIsClosing(true);
    closeTimerRef.current = setTimeout(
      () => dialogRef.current?.close(),
      CLOSE_ANIMATION_MS,
    );
  }

  // Esc would close the dialog instantly; run it through closeDialog to animate it.
  // Catch it on keydown: Chrome ignores preventDefault() on "cancel" if the user
  // hasn't clicked inside the dialog yet. onCancel still covers other close
  // requests (e.g. the Android back gesture).
  function handleKeyDown(e) {
    if (e.key !== "Escape") return;
    e.preventDefault();
    closeDialog();
  }

  function handleCancel(e) {
    e.preventDefault();
    closeDialog();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeDialog();
  }

  function toggleExtra(extraId) {
    setExtraIds((ids) =>
      ids.includes(extraId)
        ? ids.filter((id) => id !== extraId)
        : [...ids, extraId],
    );
  }

  function handleAddToCart() {
    addToCart(createCartItem(pizza, { sizeId, extraIds, quantity }));
    closeDialog();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className={`mt-auto max-h-[90dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl bg-white text-stone-700 shadow-xl transition backdrop:bg-stone-900/50 backdrop:backdrop-blur-sm backdrop:transition motion-reduce:transition-none sm:m-auto sm:max-w-xl sm:rounded-3xl starting:translate-y-8 starting:opacity-0 starting:backdrop:opacity-0 ${
        isClosing
          ? "translate-y-8 opacity-0 duration-200 backdrop:opacity-0 backdrop:duration-200"
          : "duration-300 backdrop:duration-300"
      }`}
    >
      <div className="relative p-5 sm:p-6">
        <button
          onClick={closeDialog}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200 hover:text-stone-800 focus:outline-none focus-visible:ring focus-visible:ring-yellow-400"
        >
          &#10005;
        </button>

        <div className="flex items-start gap-4 sm:gap-5">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl sm:size-48">
            <img
              src={imageUrl}
              alt={name}
              className={`h-full w-full object-cover ${soldOut ? "grayscale" : ""}`}
            />
            {soldOut && (
              <span className="absolute top-2 left-2 rounded-full bg-stone-800/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-stone-100 uppercase sm:px-2.5 sm:py-1 sm:text-xs">
                Sold out
              </span>
            )}
            <FavoriteButton
              pizzaId={pizza.id}
              pizzaName={name}
              className="absolute top-2 right-2 size-8 sm:size-9"
            />
          </div>

          <div className="min-w-0 grow">
            <h2 className="pr-10 text-xl font-bold text-stone-800">{name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <p
                className={`text-lg font-semibold ${soldOut ? "text-stone-400" : "text-stone-800"}`}
              >
                {formatCurrency(itemPrice)}
              </p>
              <PizzaTags pizza={pizza} />
            </div>
            <h3 className={`mt-4 ${headingStyle}`}>Ingredients</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="rounded-full bg-stone-100 px-2.5 py-1 text-sm text-stone-600 capitalize"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
            {quantityInCart > 0 && (
              <p className="mt-3 text-xs text-stone-500">
                {quantityInCart} already in your cart
              </p>
            )}
          </div>
        </div>

        {!soldOut && (
          <>
            <fieldset className="mt-6">
              <legend className={headingStyle}>Size</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <label
                    key={size.id}
                    className={`${optionStyle} rounded-2xl px-2 py-2.5 text-center`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size.id}
                      checked={sizeId === size.id}
                      onChange={() => setSizeId(size.id)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold text-stone-800">
                      {size.label}
                    </span>
                    <span className="block text-xs text-stone-500">
                      {size.detail}
                    </span>
                    {size.priceChange !== 0 && (
                      <span className="block text-xs text-stone-500">
                        {formatPriceChange(size.priceChange)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className={headingStyle}>Extras</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {EXTRAS.map((extra) => {
                  const isChecked = extraIds.includes(extra.id);
                  return (
                    <label
                      key={extra.id}
                      className={`${optionStyle} rounded-full px-3 py-1.5 text-sm`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleExtra(extra.id)}
                        className="sr-only"
                      />
                      {isChecked && "✓ "}
                      {extra.label}{" "}
                      <span className="text-stone-500">
                        {formatPriceChange(extra.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </>
        )}

        {/* negative margins let the sticky footer cover the padding, so content doesn't show through */}
        <div className="sticky bottom-0 -mx-5 mt-6 -mb-5 border-t border-stone-200 bg-white px-5 py-5 sm:-mx-6 sm:-mb-6 sm:px-6">
          {soldOut ? (
            <p className="text-center text-sm text-stone-500">
              Sorry, this pizza is sold out right now.
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  type="round"
                  disabled={quantity === 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span
                  key={quantity}
                  className="motion-safe:animate-bump inline-block w-6 text-center font-semibold"
                >
                  {quantity}
                </span>
                <Button type="round" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </Button>
              </div>
              <Button type="primary" onClick={handleAddToCart}>
                Add<span className="hidden sm:inline"> to cart</span> &middot;{" "}
                {formatCurrency(itemPrice * quantity)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default PizzaDetails;
