function EmptyState({
  title = "Nothing here yet",
  message = "There are no results to show.",
  action = null,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xl text-white/30"
      >
        ◌
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
        {message}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;