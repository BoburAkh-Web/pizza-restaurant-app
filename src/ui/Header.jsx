import React from "react";
import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <header>
      <Link to="/">Fast React Pizza Co.</Link>
      <Link to="/menu">Menu</Link>
      <SearchOrder />
      <p>Bobur</p>
    </header>
  );
}

export default Header;
