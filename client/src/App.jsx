import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppShell from "./components/layout/AppShell.jsx";
import DiscoverPage from "./pages/Discover/DiscoverPage.jsx";
import SearchResultsPage from "./pages/SearchResults/SearchResultsPage.jsx";
import MovieDetailsPage from "./pages/MovieDetails/MovieDetailsPage.jsx";
import WishlistPage from "./pages/Wishlist/WishlistPage.jsx";

import { useWishlist } from "./features/wishlist/useWishlist.js";

function App() {
  const { loadWishlist } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route
            path="/movie/:id"
            element={<MovieDetailsPage />}
          />
          <Route
            path="/wishlist"
            element={<WishlistPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;