import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";
import { addItem, getCurrentQuantityById } from "../cart/cartSlice";
import DeletePizza from "../cart/DeletePizza";
import UpdateQuantity from "../cart/UpdateQuantity";
import PizzaTags from "./PizzaTags";

function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;
  console.log(currentQuantity);
  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      unitPrice,
      quantity: 1,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  }
  return (
    <li
      className={`group relative flex gap-4 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200 transition duration-300 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-yellow-400 sm:flex-col sm:gap-3 ${
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
      </div>
      <div className="flex grow flex-col">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* after:inset-0 stretches the link over the whole card */}
          <Link
            to={`/menu/${id}`}
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
        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p
            className={`font-semibold ${soldOut ? "text-stone-400" : "text-stone-800"}`}
          >
            {formatCurrency(unitPrice)}
          </p>
          {isInCart && (
            <div className="flex items-center gap-2 sm:gap-3">
              <UpdateQuantity pizzaId={id} currentQuantity={currentQuantity} />
              <DeletePizza pizzaId={id} />
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
