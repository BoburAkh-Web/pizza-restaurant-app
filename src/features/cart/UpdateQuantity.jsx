import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuant, increaseItemQuant } from "./cartSlice";

function UpdateQuantity({ cartItemId, currentQuantity }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button
        type="round"
        onClick={() => dispatch(decreaseItemQuant(cartItemId))}
      >
        -
      </Button>
      <span
        key={currentQuantity}
        className="motion-safe:animate-bump inline-block min-w-4 text-center"
      >
        {currentQuantity}
      </span>
      <Button
        type="round"
        onClick={() => dispatch(increaseItemQuant(cartItemId))}
      >
        +
      </Button>
    </div>
  );
}

export default UpdateQuantity;
