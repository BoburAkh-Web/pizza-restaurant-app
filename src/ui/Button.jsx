import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  // focus-visible, not focus: on phones a tapped button keeps focus, so a focus ring would stay on it
  const base =
    "inline-block text-sm cursor-pointer rounded-full bg-yellow-400  font-semibold tracking-wide text-stone-800 uppercase transition duration-300 hover:bg-yellow-300 hover:text-white focus-visible:bg-yellow-300 focus-visible:ring focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus:outline-none enabled:active:scale-95 disabled:cursor-not-allowed ";
  const styles = {
    primary: base + "px-4 py-3 md:px-6 md:py-4",
    small: base + "px-4 py-2 md:px-5 md:py-2.5 text-xs",
    round: base + "px-4 py-2.5 md:px-4 md:py-2.5 text-sm",
    secondary:
      "inline-block text-sm rounded-full border-2 border-stone-300 font-semibold uppercase tracking-wide text-stone-400 transition-colors duration-300 hover:bg-stone-300 hover:text-stone-800 focus-visible:bg-stone-300 focus-visible:text-stone-800 focus:outline-none focus-visible:ring focus-visible:ring-stone-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed px-4 py-2.5 md:px-6 md:py-3.5",
  };

  if (to) {
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );
  }
  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );
  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
