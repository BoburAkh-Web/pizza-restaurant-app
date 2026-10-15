import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <Link to="/">Fast React Pizza Co.</Link>
      <Link to="/menu">Menu</Link>
      <p>Bobur</p>
    </header>
  );
}

export default Header;
