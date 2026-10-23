import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

function DeletePizza({ cartItemId }) {
  const dispatch = useDispatch();
  return (
    <Button type="small" onClick={() => dispatch(deleteItem(cartItemId))}>
      Delete
    </Button>
  );
}

export default DeletePizza;
