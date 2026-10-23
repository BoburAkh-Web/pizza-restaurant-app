import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { describeOptions } from "../menu/pizzaOptions";
import { addItem, undoAddItem } from "./cartSlice";

// Adds an item to the cart and confirms it with a toast that has an Undo button
export function useAddToCart() {
  const dispatch = useDispatch();

  return function addToCart(item) {
    dispatch(addItem(item));
    const options = describeOptions(item);

    function handleUndo(toastId) {
      dispatch(
        undoAddItem({ cartItemId: item.cartItemId, quantity: item.quantity }),
      );
      toast.dismiss(toastId);
    }

    toast.success(
      (t) => (
        <span className="flex items-center gap-3">
          <span className="min-w-0 text-sm">
            <span className="font-semibold">
              {item.quantity}&times; {item.name}
            </span>{" "}
            added
            {options && (
              <span className="block text-xs text-stone-500">{options}</span>
            )}
          </span>
          <button
            onClick={() => handleUndo(t.id)}
            className="shrink-0 cursor-pointer rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold tracking-wide text-stone-800 uppercase transition hover:bg-yellow-300 focus:outline-none focus-visible:ring focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
          >
            Undo
          </button>
        </span>
      ),
      // one toast per cart line: adding the same item again updates it instead of stacking
      { id: item.cartItemId, duration: 4000 },
    );
  };
}
