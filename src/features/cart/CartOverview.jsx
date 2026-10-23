import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);
  if (!totalCartPrice || !totalCartQuantity) return;
  return (
    <div className="motion-safe:animate-slide-up flex items-center justify-between bg-stone-800 px-4 py-3 text-stone-200 uppercase">
      <p className="flex items-center gap-3 font-semibold text-stone-300">
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
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
