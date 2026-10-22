import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuant, increaseItemQuant } from "./cartSlice";

function UpdateQuantity({ pizzaId, currentQuantity }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button type="round" onClick={() => dispatch(decreaseItemQuant(pizzaId))}>
        -
      </Button>
      <span>{currentQuantity}</span>
      <Button type="round" onClick={() => dispatch(increaseItemQuant(pizzaId))}>
        +
      </Button>
    </div>
  );
}

export default UpdateQuantity;
