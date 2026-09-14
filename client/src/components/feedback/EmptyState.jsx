function EmptyState({
  title = "Nothing here yet",
  message = "There are no results to show.",
  action = null,
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 text-4xl text-white/20">◌</div>

      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
        {message}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;