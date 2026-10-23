import { useDispatch, useSelector } from "react-redux";
import { getIsFavorite, toggleFavorite } from "./favoritesSlice";

function FavoriteButton({ pizzaId, pizzaName, className = "" }) {
  const dispatch = useDispatch();
  const isFavorite = useSelector(getIsFavorite(pizzaId));

  return (
    <button
      onClick={() => dispatch(toggleFavorite(pizzaId))}
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `Remove ${pizzaName} from favorites`
          : `Add ${pizzaName} to favorites`
      }
      className={`flex cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110 focus:outline-none focus-visible:ring focus-visible:ring-yellow-400 active:scale-90 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        strokeWidth="2"
        aria-hidden
        className={`size-1/2 transition-colors ${
          isFavorite
            ? "fill-red-500 stroke-red-500"
            : "fill-none stroke-stone-600"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;
