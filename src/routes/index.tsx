import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search,
  Mic,
  Bell,
  ShoppingCart,
  Star,
  BadgeCheck,
  Home,
  LayoutGrid,
  Heart,
  User,
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Headphones,
  WashingMachine,
  Sofa,
  ShoppingBasket,
  Sparkles,
  Gift,
} from "lucide-react";
import { getProducts, type Product } from "@/lib/catalog.functions";
import { useSession } from "@/hooks/useSession";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => getProducts(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "ShopKart — Mobiles, Fashion & Electronics Online" },
      {
        name: "description",
        content:
          "Shop mobiles, laptops, fashion, electronics and home essentials at big discounts on ShopKart.",
      },
      { property: "og:title", content: "ShopKart — Online Shopping App" },
      {
        property: "og:description",
        content: "Daily deals on mobiles, laptops, fashion and home essentials.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
  errorComponent: () => (
    <div className="p-6 text-center text-sm text-muted-foreground">
      Products could not be loaded. Please refresh.
    </div>
  ),
  notFoundComponent: () => <div className="p-6 text-center">Not found</div>,
});

const CATEGORIES = [
  "Mobiles",
  "Fashion",
  "Electronics",
  "Laptops",
  "Appliances",
  "Home",
  "Grocery",
  "Beauty",
];

const CATEGORY_ICONS: Record<string, typeof Gift> = {
  Mobiles: Smartphone,
  Laptops: Laptop,
  Fashion: Shirt,
  Electronics: Headphones,
  Appliances: WashingMachine,
  Home: Sofa,
  Grocery: ShoppingBasket,
  Beauty: Sparkles,
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function HomePage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { session } = useSession();
  const [active, setActive] = useState<string>("All");

  const deals = useMemo(() => products.filter((p) => p.featured).slice(0, 8), [products]);
  const grid = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [products, active],
  );

  return (
    <div className="min-h-screen bg-surface pb-20">
      <header className="sticky top-0 z-20 bg-brand text-brand-foreground shadow-md">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 pt-3">
          <span className="text-lg font-bold italic tracking-tight">ShopKart</span>
          <div className="ml-auto flex items-center gap-4">
            <Bell className="h-5 w-5" aria-hidden />
            <ShoppingCart className="h-5 w-5" aria-hidden />
          </div>
        </div>
        <div className="mx-auto max-w-md px-4 py-3">
          <label className="flex items-center gap-2 rounded-md bg-background px-3 py-2.5 text-foreground shadow-sm">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              placeholder="Search for mobiles, shoes, TVs…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search products"
            />
            <Mic className="h-4 w-4 text-brand" aria-hidden />
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-md">
        <h1 className="sr-only">ShopKart online shopping</h1>

        <section className="bg-background px-2 py-4" aria-label="Categories">
          <div className="grid grid-cols-4 gap-y-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    active === c ? "bg-brand/15 ring-2 ring-brand" : "bg-surface"
                  }`}
                >
                  <CategoryIcon category={c} className="h-6 w-6 text-brand" />
                </span>
                <span className="text-[11px] font-medium text-foreground">{c}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-2 px-3 py-4" aria-label="Offer banner">
          <div className="rounded-xl bg-gradient-to-r from-brand to-brand-dark p-5 text-brand-foreground shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
              Big Saving Days
            </p>
            <p className="mt-1 text-2xl font-bold leading-tight">Up to 75% off</p>
            <p className="mt-1 text-sm opacity-90">On mobiles, fashion &amp; electronics</p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">
              Shop now <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
        </section>

        <section className="bg-background py-4" aria-label="Deals of the day">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-base font-bold text-foreground">Deals of the Day</h2>
            <span className="text-xs font-semibold text-brand">View all</span>
          </div>
          <div className="mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
            {deals.map((p) => (
              <article
                key={p.id}
                className="w-32 shrink-0 snap-start rounded-lg border border-border bg-card p-2"
              >
                <div className="flex h-24 items-center justify-center rounded-md bg-surface">
                  <CategoryIcon category={p.category} className="h-8 w-8 text-brand" />
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-medium text-card-foreground">
                  {p.name}
                </p>
                <p className="mt-1 text-xs font-bold text-price-drop">{p.discount}% off</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-2 bg-background px-3 py-4" aria-label="Products">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              {active === "All" ? "Recommended for you" : active}
            </h2>
            {active !== "All" && (
              <button
                onClick={() => setActive("All")}
                className="text-xs font-semibold text-brand"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {grid.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {grid.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No products in this category yet.
            </p>
          )}
        </section>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background">
        <div className="mx-auto flex max-w-md items-center justify-around py-2">
          <TabItem icon={<Home className="h-5 w-5" />} label="Home" activeTab />
          <TabItem icon={<LayoutGrid className="h-5 w-5" />} label="Categories" />
          <TabItem icon={<Heart className="h-5 w-5" />} label="Wishlist" />
          <Link to="/auth" className="flex flex-col items-center gap-0.5 text-muted-foreground">
            <User className="h-5 w-5" aria-hidden />
            <span className="text-[10px] font-medium">
              {session ? "Account" : "Login"}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function TabItem({
  icon,
  label,
  activeTab,
}: {
  icon: React.ReactNode;
  label: string;
  activeTab?: boolean;
}) {
  return (
    <span
      className={`flex flex-col items-center gap-0.5 ${
        activeTab ? "text-brand" : "text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </span>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  return (
    <article className="rounded-lg border border-border bg-card p-2.5">
      <div className="flex h-32 items-center justify-center rounded-md bg-surface">
        <CategoryIcon category={p.category} className="h-12 w-12 text-brand" />
      </div>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {p.brand}
      </p>
      <h3 className="line-clamp-2 text-xs font-medium text-card-foreground">{p.name}</h3>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="flex items-center gap-0.5 rounded bg-success px-1.5 py-0.5 text-[10px] font-bold text-brand-foreground">
          {p.rating} <Star className="h-2.5 w-2.5 fill-current" aria-hidden />
        </span>
        <span className="text-[10px] text-muted-foreground">
          ({p.ratings_count.toLocaleString("en-IN")})
        </span>
        {p.assured && <BadgeCheck className="h-3.5 w-3.5 text-brand" aria-hidden />}
      </div>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
        <span className="text-sm font-bold text-card-foreground">{rupees(p.price)}</span>
        {p.old_price && (
          <span className="text-[11px] text-muted-foreground line-through">
            {rupees(p.old_price)}
          </span>
        )}
        <span className="text-[11px] font-bold text-price-drop">{p.discount}% off</span>
      </div>
    </article>
  );
}

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICONS[category] ?? Gift;
  return <Icon className={className} aria-hidden />;
}
