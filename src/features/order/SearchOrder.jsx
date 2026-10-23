import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// onSearch: lets the header close its mobile search bar after a search
function SearchOrder({ autoFocus = false, onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
    onSearch?.();
  }
  return (
    <form onSubmit={handleSubmit} className="grow sm:grow-0">
      {/* text-base on phones: iOS zooms into inputs with a font smaller than 16px */}
      <input
        type="text"
        placeholder="Search order #"
        aria-label="Search order number"
        value={query}
        autoFocus={autoFocus}
        className="focus:ring-opacity-50 w-full rounded-full bg-yellow-100 px-4 py-2 text-base transition-all duration-300 placeholder:text-stone-400 focus:ring focus:ring-yellow-500 focus:outline-none sm:w-64 sm:text-sm sm:focus:w-72"
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

export default SearchOrder;
