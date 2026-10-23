import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
import DeletePizza from "../cart/DeletePizza";
import UpdateQuantity from "../cart/UpdateQuantity";
import PizzaTags from "./PizzaTags";

function PizzaDetails() {
  const { pizzaId } = useParams();
  const menu = useRouteLoaderData("menu");
  const pizza = menu.find((pizza) => pizza.id === Number(pizzaId));
  const currentQuantity = useSelector(getCurrentQuantityById(Number(pizzaId)));
  const isInCart = currentQuantity > 0;
  const [quantity, setQuantity] = useState(1);
  const dialogRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  if (!pizza) return <Navigate to="/menu" replace />;
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  // Opened from the menu -> go back in history, so the browser Back button stays consistent.
  // Opened directly from a link -> there is nothing to go back to, so replace with /menu.
  function handleClose() {
    if (location.key !== "default") navigate(-1);
    else navigate("/menu", { replace: true });
  }

  function closeDialog() {
    dialogRef.current.close();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) closeDialog();
  }

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      unitPrice,
      quantity,
      totalPrice: unitPrice * quantity,
    };
    dispatch(addItem(newItem));
    closeDialog();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      className="mt-auto max-h-[90dvh] w-full max-w-none rounded-t-3xl bg-white text-stone-700 shadow-xl transition duration-300 backdrop:bg-stone-900/50 backdrop:backdrop-blur-sm starting:translate-y-8 starting:opacity-0 motion-reduce:transition-none sm:m-auto sm:max-w-xl sm:rounded-3xl"
    >
      <div className="relative p-5 sm:p-6">
        <button
          onClick={closeDialog}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-stone-200 hover:text-stone-800 focus:ring focus:ring-yellow-400 focus:outline-none"
        >
          &#10005;
        </button>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="relative size-48 shrink-0 overflow-hidden rounded-2xl">
            <img
              src={imageUrl}
              alt={name}
              className={`h-full w-full object-cover ${soldOut ? "grayscale" : ""}`}
            />
            {soldOut && (
              <span className="absolute top-2 left-2 rounded-full bg-stone-800/80 px-2.5 py-1 text-xs font-semibold tracking-wide text-stone-100 uppercase">
                Sold out
              </span>
            )}
          </div>

          <div className="w-full">
            <h2 className="pr-10 text-xl font-bold text-stone-800">{name}</h2>
            <div className="mt-1 flex items-center gap-2">
              <p
                className={`text-lg font-semibold ${soldOut ? "text-stone-400" : "text-stone-800"}`}
              >
                {formatCurrency(unitPrice)}
              </p>
              <PizzaTags pizza={pizza} />
            </div>
            <h3 className="mt-4 text-xs font-semibold tracking-wide text-stone-400 uppercase">
              Ingredients
            </h3>
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
          </div>
        </div>

        <div className="mt-6 border-t border-stone-200 pt-5">
          {soldOut && (
            <p className="text-center text-sm text-stone-500">
              Sorry, this pizza is sold out right now.
            </p>
          )}

          {!soldOut && isInCart && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">In your cart</p>
              <div className="flex items-center gap-3">
                <UpdateQuantity pizzaId={id} currentQuantity={currentQuantity} />
                <DeletePizza pizzaId={id} />
              </div>
            </div>
          )}

          {!soldOut && !isInCart && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  type="round"
                  disabled={quantity === 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <Button type="round" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </Button>
              </div>
              <Button type="primary" onClick={handleAddToCart}>
                Add<span className="hidden sm:inline"> to cart</span> &middot;{" "}
                {formatCurrency(unitPrice * quantity)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default PizzaDetails;
