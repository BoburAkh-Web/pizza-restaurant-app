import { useState } from "react";
import { Link } from "react-router-dom";
import CartIcon from "../features/cart/CartIcon";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

const iconButtonStyle =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-yellow-300 focus-visible:ring focus-visible:ring-yellow-500 focus:outline-none";

function Header() {
  // phones only: the search field is hidden behind an icon and opens over the whole header
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-3 border-b border-stone-200 bg-yellow-400 px-4 py-3 uppercase sm:px-6">
      {isSearchOpen && (
        <div className="flex w-full items-center gap-2 sm:hidden">
          <SearchOrder autoFocus onSearch={() => setIsSearchOpen(false)} />
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className={iconButtonStyle}
          >
            &#10005;
          </button>
        </div>
      )}

      <Link
        to="/"
        className={`text-sm tracking-wide whitespace-nowrap sm:text-base sm:tracking-widest ${
          isSearchOpen ? "hidden sm:block" : ""
        }`}
      >
        Fast React Pizza Co.
      </Link>

      <div className="hidden sm:block">
        <SearchOrder />
      </div>

      <div
        className={`items-center gap-1 sm:gap-3 ${isSearchOpen ? "hidden sm:flex" : "flex"}`}
      >
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search order"
          className={`${iconButtonStyle} sm:hidden`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            aria-hidden
            className="size-5 stroke-stone-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
        {/* no room for the name on phones */}
        <div className="hidden sm:block">
          <Username />
        </div>
        <CartIcon />
      </div>
    </header>
  );
}

export default Header;
