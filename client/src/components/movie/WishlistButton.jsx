import { useWishlist } from "../../features/wishlist/useWishlist.js";

function WishlistButton({ movie }) {
  const {
    isSaved,
    isPending,
    toggleWishlist,
  } = useWishlist();

  const saved = isSaved(movie.id);
  const pending = isPending(movie.id);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (pending) {
      return;
    }

    toggleWishlist(movie);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={
        saved
          ? `Remove ${movie.title} from wishlist`
          : `Save ${movie.title} to wishlist`
      }
      aria-pressed={saved}
      aria-busy={pending}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/70 text-xl text-white backdrop-blur-sm transition hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-wait disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className={saved ? "text-amber-400" : "text-white"}
      >
        {pending ? "…" : saved ? "♥" : "♡"}
      </span>
    </button>
  );
}

export default WishlistButton;