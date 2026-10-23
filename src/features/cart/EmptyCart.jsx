import Button from "../../ui/Button";
import LinkButton from "../../ui/LinkButton";

function EmptyCart() {
  return (
    <div className="px-4 py-3">
      <LinkButton to="/menu" type="primary">
        &larr; Back to menu
      </LinkButton>

      <div className="mt-12 text-center">
        <p className="text-5xl" aria-hidden>
          🍕
        </p>
        <p className="mt-4 font-semibold text-stone-800">
          Your cart is still empty.
        </p>
        <p className="mt-1 text-sm text-stone-500">
          Start adding some pizzas :)
        </p>
        <div className="mt-6">
          <Button to="/menu" type="primary">
            See the menu
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmptyCart;
