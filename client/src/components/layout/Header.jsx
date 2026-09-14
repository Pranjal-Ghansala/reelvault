import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Discover",
    to: "/",
  },
  {
    label: "Search",
    to: "/search",
  },
  {
    label: "Wishlist",
    to: "/wishlist",
  },
];

function Header() {
  return (
    <header className="border-b border-white/10 bg-[#0d0d0f]/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-lg font-bold tracking-[0.18em]"
          aria-label="ReelVault home"
        >
          REELVAULT
        </NavLink>

        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-6">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm transition ${
                      isActive
                        ? "text-amber-400"
                        : "text-white/60 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;