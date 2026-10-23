// Orders placed in this browser, newest first: [{ id, placedAt }].
// Kept in localStorage so order tracking survives a page reload. placedAt is saved
// here because the API doesn't return createdAt when an order is fetched later.
const STORAGE_KEY = "recentOrders";
const MAX_ORDERS = 3;

export function getRecentOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(orders)
      ? orders.filter((order) => typeof order?.id === "string")
      : [];
  } catch {
    return [];
  }
}

function saveRecentOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // storage blocked (e.g. private mode): tracking just won't survive a reload
  }
}

export function addRecentOrder(id) {
  const orders = getRecentOrders().filter((order) => order.id !== id);
  saveRecentOrders(
    [{ id, placedAt: Date.now() }, ...orders].slice(0, MAX_ORDERS),
  );
}

export function removeRecentOrder(id) {
  const orders = getRecentOrders().filter((order) => order.id !== id);
  saveRecentOrders(orders);
  return orders;
}
