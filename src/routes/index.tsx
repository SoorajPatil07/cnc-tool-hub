import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="space-y-12">
      <section
        className="rounded-2xl p-12 text-[var(--industrial-foreground)] text-center"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-tool)" }}
      >
        <h1 className="text-5xl font-bold tracking-tight mb-4">CNC Machine Tools</h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90 mb-8">
          High-precision tooling for industrial machining. Browse our inventory and place
          your order with a custom delivery date.
        </p>
        <Link
          to="/order"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:opacity-90 transition"
        >
          Browse & Order Tools
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Package, title: "Quality Inventory", desc: "Carefully curated CNC tools for every job." },
          { icon: ShieldCheck, title: "Trusted Supplier", desc: "Years of experience supplying precision parts." },
          { icon: Truck, title: "Scheduled Delivery", desc: "Pick the date that fits your production schedule." },
        ].map((f) => (
          <div key={f.title} className="bg-card border rounded-xl p-6 text-center">
            <f.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
