import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartQuantity } from "./cartSlice";

function CartIcon() {
  const quantity = useSelector(getTotalCartQuantity);

  return (
    <Link
      to="/cart"
      aria-label={`Cart, ${quantity} ${quantity === 1 ? "pizza" : "pizzas"}`}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-yellow-300 focus:outline-none focus-visible:ring focus-visible:ring-yellow-500"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        aria-hidden
        className="size-6 stroke-stone-800"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
        />
      </svg>
      {quantity > 0 && (
        // a new key remounts the badge, which replays the bump animation
        <span
          key={quantity}
          className="motion-safe:animate-bump absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-800 px-1 text-[11px] font-bold text-yellow-400"
        >
          {quantity}
        </span>
      )}
    </Link>
  );
}

export default CartIcon;
