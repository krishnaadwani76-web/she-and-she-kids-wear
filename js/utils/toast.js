/**
 * Toast Notification System
 * Non-intrusive, accessible notifications with pastel kidswear styling.
 */

export function showToast(message, type = "success", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto transform transition-all duration-300 ease-out translate-y-3 opacity-0 flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl text-sm font-medium border ${
    type === "success"
      ? "bg-white text-slate-800 border-rose-200 shadow-rose-100/50"
      : type === "error"
      ? "bg-rose-50 text-rose-900 border-rose-300 shadow-rose-200/50"
      : "bg-white text-slate-800 border-amber-200 shadow-amber-100/50"
  }`;

  const iconSvg =
    type === "success"
      ? `<div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>`
      : type === "error"
      ? `<div class="w-8 h-8 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </div>`
      : `<div class="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 pr-2">${message}</div>
    <button type="button" class="text-slate-400 hover:text-slate-600 p-1 text-xs" aria-label="Close">✕</button>
  `;

  const closeBtn = toast.querySelector("button");
  closeBtn.addEventListener("click", () => removeToast(toast));

  container.appendChild(toast);

  // Trigger entrance transition
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-3", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  // Auto dismiss
  const timer = setTimeout(() => {
    removeToast(toast);
  }, duration);

  function removeToast(el) {
    clearTimeout(timer);
    el.classList.remove("translate-y-0", "opacity-100");
    el.classList.add("translate-y-3", "opacity-0");
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 300);
  }
}
