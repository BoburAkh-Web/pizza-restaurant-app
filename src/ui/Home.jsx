import { useSelector } from "react-redux";
import { EXTRAS, SIZES } from "../features/menu/pizzaOptions";
import CreateUser from "../features/user/CreateUser";
import Button from "./Button";

// counted from the real options, so the text stays true if they change
const FEATURES = [
  `${SIZES.length} sizes`,
  `${EXTRAS.length} extras`,
  "Live order tracking",
];

function Home() {
  const username = useSelector((state) => state.user.username);
  return (
    <section className="relative isolate flex min-h-full items-end overflow-hidden p-4 sm:p-8 lg:items-center lg:px-16">
      {/* Photo by Aurélien Lemasson-Théobald (Unsplash License), shown as it is: no overlay, no fade.
          Each screen shape gets its own crop, so the pizza is never zoomed in too far:
          phones 9:16, upright tablets 4:5, landscape screens 16:9. */}
      <picture>
        <source
          media="(max-aspect-ratio: 2/3)"
          srcSet="/images/hero-pizza-tall-750.webp 750w, /images/hero-pizza-tall-1080.webp 1080w"
          sizes="100vw"
        />
        <source
          media="(max-aspect-ratio: 1/1)"
          srcSet="/images/hero-pizza-portrait-1080.webp"
        />
        <img
          src="/images/hero-pizza-wide-1280.webp"
          srcSet="/images/hero-pizza-wide-1280.webp 1280w, /images/hero-pizza-wide-1920.webp 1920w"
          sizes="100vw"
          alt="Freshly baked margherita pizza with basil"
          fetchPriority="high"
          className="motion-safe:animate-hero-zoom absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </picture>

      {/* Clear glass: only a light blur, so the photo stays clearly visible through the card.
          A faint dark tint + text shadow keep the white text readable on the bright cheese. */}
      <div className="motion-safe:animate-fade-up mx-auto w-full max-w-md rounded-3xl border border-white/30 bg-black/20 p-6 text-center text-white shadow-2xl backdrop-blur-[6px] sm:max-w-lg sm:p-8 lg:mx-0 lg:max-w-xl lg:p-10 lg:text-left">
        <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold tracking-widest text-stone-800 uppercase shadow-sm">
          🔥 Hot from the oven
        </span>
        <h1 className="mt-5 mb-8 font-bold text-shadow-lg">
          <span className="block text-3xl sm:text-4xl lg:text-5xl">
            The best pizza.
          </span>
          {/* the <br> keeps the two halves on their own lines */}
          <span className="mt-3 block text-lg leading-relaxed sm:text-xl lg:text-2xl">
            Straight out of the oven,
            <br />
            straight to you.
          </span>
        </h1>

        {username === "" ? (
          <CreateUser />
        ) : (
          <Button to="/menu" type="primary">
            Back to menu
          </Button>
        )}

        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-shadow-md lg:justify-start">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-yellow-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="https://unsplash.com/photos/round-cooked-pizza-x00CzBt4Dfk"
        target="_blank"
        rel="noreferrer"
        className="absolute top-2 right-3 text-[10px] text-white/80 transition text-shadow-sm hover:text-white lg:top-auto lg:bottom-2"
      >
        Photo: Aurélien Lemasson-Théobald / Unsplash
      </a>
    </section>
  );
}

export default Home;
