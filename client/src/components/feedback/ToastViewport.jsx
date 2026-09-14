import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.js";
import { removeToast } from "../../features/ui/uiSlice.js";

function Toast({ toast }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, toast.id]);

  const typeClasses = {
    success: "border-emerald-400/20 bg-emerald-400/10",
    error: "border-red-400/20 bg-red-400/10",
    info: "border-white/10 bg-white/10",
  };

  return (
    <div
      role="status"
      className={`rounded-lg border px-4 py-3 text-sm text-white shadow-xl backdrop-blur-md ${
        typeClasses[toast.type] || typeClasses.info
      }`}
    >
      {toast.message}
    </div>
  );
}

function ToastViewport() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;