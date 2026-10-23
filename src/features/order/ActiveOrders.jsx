import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import { formatCurrency } from "../../utils/helpers";
import { getRecentOrders, removeRecentOrder } from "./recentOrders";

// Re-renders every intervalMs, so the "minutes left" and the progress stay current
function useNow(intervalMs) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatTime(dateStr) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

const trackButtonStyle =
  "rounded-full bg-yellow-400 font-semibold tracking-wide text-stone-800 uppercase transition hover:bg-yellow-300 focus-visible:ring focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus:outline-none";

function LiveStatus({ status }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-green-700 uppercase">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-green-400 opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      {status}
    </span>
  );
}

const RING_RADIUS = 28;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function ProgressRing({ progress, minutesLeft }) {
  return (
    <div className="relative size-20 shrink-0">
      {/* rotated so the progress starts at 12 o'clock */}
      <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="5"
          className="stroke-stone-100"
        />
        {progress !== null && (
          <circle
            cx="32"
            cy="32"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - progress)}
            className="stroke-yellow-400 transition-[stroke-dashoffset] duration-1000"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-2xl font-bold text-stone-800">{minutesLeft}</span>
        <span className="text-[10px] font-semibold tracking-wide text-stone-400 uppercase">
          min
        </span>
      </div>
    </div>
  );
}

// Only on wide screens: on small screens the strip above the menu shows orders still on the way
function DeliveredOrder({ id, status, totalPrice, onRemove }) {
  return (
    <div className="wide:flex hidden items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-stone-200">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700"
      >
        &#10003;
      </span>
      <div className="min-w-0 grow">
        <p className="text-sm font-semibold text-stone-800">
          {status === "delivered" ? "Delivered" : "Should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          <Link
            to={`/order/${id}`}
            className="underline-offset-2 hover:text-stone-800 hover:underline"
          >
            #{id}
          </Link>{" "}
          &middot; {formatCurrency(totalPrice)}
        </p>
      </div>
      <button
        onClick={() => onRemove(id)}
        aria-label={`Hide order #${id}`}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-xs text-stone-500 transition hover:bg-stone-200 hover:text-stone-800"
      >
        &#10005;
      </button>
    </div>
  );
}

function ActiveOrder({ orderId, placedAt, onRemove }) {
  const [order, setOrder] = useState(null);
  const [hasError, setHasError] = useState(false);
  const now = useNow(30_000);

  useEffect(() => {
    let ignore = false;
    getOrder(orderId)
      .then((data) => !ignore && setOrder(data))
      .catch(() => !ignore && setHasError(true));
    return () => {
      ignore = true;
    };
  }, [orderId]);

  if (hasError) return null;
  if (!order)
    return (
      <div className="wide:h-72 h-28 rounded-2xl bg-stone-200 motion-safe:animate-pulse" />
    );

  const {
    id,
    status,
    priority,
    estimatedDelivery,
    orderPrice,
    priorityPrice,
    cart,
  } = order;
  const totalPrice = orderPrice + priorityPrice;
  const end = new Date(estimatedDelivery).getTime();
  const minutesLeft = Math.max(1, Math.round((end - now) / 60_000));
  // without placedAt (unknown start) there is nothing to measure progress from
  const progress =
    placedAt && end > placedAt
      ? Math.min(1, Math.max(0, (now - placedAt) / (end - placedAt)))
      : null;

  if (now >= end)
    return (
      <DeliveredOrder
        id={id}
        status={status}
        totalPrice={totalPrice}
        onRemove={onRemove}
      />
    );

  return (
    // the yellow ring (same yellow as the header) marks orders that are still on the way
    <div className="rounded-2xl bg-white p-4 text-stone-600 shadow-sm ring-2 ring-yellow-400">
      <div className="flex items-center justify-between gap-2">
        <LiveStatus status={status} />
        <span className="text-xs text-stone-400">#{id}</span>
      </div>

      {/* compact version: strip above the menu on smaller screens */}
      <div className="wide:hidden">
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-2xl font-bold text-stone-800">
              {minutesLeft} min
            </p>
            <p className="text-xs">
              Arrives around {formatTime(estimatedDelivery)}
            </p>
          </div>
          <Link
            to={`/order/${id}`}
            className={`${trackButtonStyle} shrink-0 px-4 py-2 text-xs`}
          >
            Track
          </Link>
        </div>
        {progress !== null && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-yellow-400 transition-[width] duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* full version: side panel on wide screens */}
      <div className="wide:block hidden">
        <div className="mt-4 flex items-center gap-4">
          <ProgressRing progress={progress} minutesLeft={minutesLeft} />
          <div>
            <p className="text-xs tracking-wide text-stone-400 uppercase">
              Arriving at
            </p>
            <p className="text-lg font-semibold text-stone-800">
              {formatTime(estimatedDelivery)}
            </p>
            {priority && (
              <span className="mt-1 inline-block rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-red-50 uppercase">
                Priority
              </span>
            )}
          </div>
        </div>

        <ul className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-sm">
          {cart.slice(0, 2).map((item, index) => (
            <li key={index} className="truncate">
              <span className="font-semibold text-stone-800">
                {item.quantity}&times;
              </span>{" "}
              {item.name}
            </li>
          ))}
          {cart.length > 2 && (
            <li className="text-stone-400">+{cart.length - 2} more</li>
          )}
        </ul>
        <p className="mt-2 flex justify-between text-sm">
          <span>Total</span>
          <span className="font-semibold text-stone-800">
            {formatCurrency(totalPrice)}
          </span>
        </p>

        <Link
          to={`/order/${id}`}
          className={`${trackButtonStyle} mt-4 block py-2.5 text-center text-sm`}
        >
          Track order &rarr;
        </Link>
      </div>
    </div>
  );
}

// Small screens: a strip above the menu. Wide screens: a panel in the empty space
// left of the menu (absolute, so the menu itself stays centered and unchanged).
function ActiveOrders() {
  const [orders, setOrders] = useState(getRecentOrders);

  if (orders.length === 0) return null;

  return (
    <aside
      aria-label="Your orders"
      className="wide:absolute wide:top-0 wide:right-full wide:bottom-0 wide:mr-6 wide:w-60 wide:p-0 px-4 pt-3"
    >
      <div className="wide:sticky wide:top-0 wide:space-y-3 wide:py-3 space-y-2">
        <h2 className="wide:block hidden text-xs font-semibold tracking-wide text-stone-400 uppercase">
          Your orders
        </h2>
        {orders.map(({ id, placedAt }) => (
          <ActiveOrder
            key={id}
            orderId={id}
            placedAt={placedAt}
            onRemove={(id) => setOrders(removeRecentOrder(id))}
          />
        ))}
      </div>
    </aside>
  );
}

export default ActiveOrders;
