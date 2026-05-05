import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Layout,
});

function Layout() {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  const tabs = [
    { to: "/", label: "Home" },
    { to: "/order", label: "Place Order" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-[var(--industrial)] text-[var(--industrial-foreground)]">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Wrench className="h-6 w-6 text-primary" />
            <span>PrecisionCNC Tools</span>
          </Link>
          <nav className="flex gap-1">
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="px-4 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors [&.active]:bg-primary"
                activeOptions={{ exact: true }}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isRoot ? <Home /> : <Outlet />}
      </main>

      <footer className="border-t mt-16 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PrecisionCNC Tools — Engineered for precision.
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="py-16 text-center">
      <div
        className="rounded-2xl p-12 text-[var(--industrial-foreground)]"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-tool)" }}
      >
        <h1 className="text-5xl font-bold tracking-tight mb-4">CNC Machine Tools</h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 mb-8">
          High-precision tooling for industrial machining. Browse our inventory and place
          your order with custom delivery dates.
        </p>
        <Link
          to="/order"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:opacity-90 transition"
        >
          Browse & Order Tools
        </Link>
      </div>
    </section>
  );
}
