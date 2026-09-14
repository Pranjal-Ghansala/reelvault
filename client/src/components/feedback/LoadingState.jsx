function LoadingState({ message = "Loading movies..." }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-400"
      />

      <p className="mt-4 text-sm text-white/50">
        {message}
      </p>
    </div>
  );
}

export default LoadingState;