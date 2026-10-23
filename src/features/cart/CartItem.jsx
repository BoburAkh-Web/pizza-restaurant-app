import { formatCurrency } from "../../utils/helpers";
import { describeOptions } from "../menu/pizzaOptions";
import DeletePizza from "./DeletePizza";
import UpdateQuantity from "./UpdateQuantity";

function CartItem({ item }) {
  const { cartItemId, name, quantity, totalPrice } = item;
  const options = describeOptions(item);
  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <div className="mb-1 sm:mb-0">
        <p>
          {quantity}&times; {name}
        </p>
        {options && <p className="text-xs text-stone-500">{options}</p>}
      </div>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <UpdateQuantity cartItemId={cartItemId} currentQuantity={quantity} />
        <DeletePizza cartItemId={cartItemId} />
      </div>
    </li>
  );
}

export default CartItem;
