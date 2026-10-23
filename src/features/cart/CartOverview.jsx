import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);
  if (!totalCartPrice || !totalCartQuantity) return;
  return (
    <div className="motion-safe:animate-slide-up flex items-center justify-between gap-3 bg-stone-800 px-4 py-3 text-sm text-stone-200 uppercase sm:px-6 sm:text-base">
      <p className="flex items-center gap-2 font-semibold text-stone-300 sm:gap-3">
        {/* a new key remounts the badge, which replays the bump animation */}
        <span
          key={totalCartQuantity}
          className="motion-safe:animate-bump flex size-8 items-center justify-center rounded-full bg-yellow-400 text-stone-800"
        >
          {totalCartQuantity}
        </span>
        <span>{totalCartQuantity === 1 ? "pizza" : "pizzas"}</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart" className="shrink-0">
        Open cart &rarr;
      </Link>
    </div>
  );
}

export default CartOverview;
