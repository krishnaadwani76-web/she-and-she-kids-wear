/**
 * Utility Formatters for She & She Kids Wear
 */

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return "₹0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function generateOrderId() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `SSKW-${randomDigits}`;
}

export function generateTrackingNumber() {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `BD-${randomDigits}`;
}

export function calculateDiscountPercent(originalPrice, discountPrice) {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}
