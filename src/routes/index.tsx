import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Star,
  BadgeCheck,
  ShoppingBag,
  Shirt,
  Smartphone,
  Sparkles,
  Laptop,
  Sofa,
  Plane,
  ImageIcon,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";

import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";
import banner3 from "@/assets/banner-3.jpg";
import banner4 from "@/assets/banner-4.jpg";
import banner5 from "@/assets/banner-5.jpg";
import pPhoneRed from "@/assets/p-phone-red.jpg";
import pLuggage from "@/assets/p-luggage.jpg";
import pChair from "@/assets/p-chair.jpg";
import pFridge from "@/assets/p-fridge.jpg";
import pPhoneOrange from "@/assets/p-phone-orange.jpg";
import pTv from "@/assets/p-tv.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopKart — Sale is Live, Up to 98% Off Online Shopping" },
      {
        name: "description",
        content:
          "Live sale on mobiles, fashion, beauty, electronics and home appliances with assured products and free two-day delivery.",
      },
      { property: "og:title", content: "ShopKart — Sale is Live" },
      {
        property: "og:description",
        content: "Up to 98% off on mobiles, fashion, electronics and appliances.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const BANNERS = [banner1, banner2, banner3, banner4, banner5];

const CATEGORIES = [
  { label: "For You", icon: ShoppingBag },
  { label: "Fashion", icon: Shirt },
  { label: "Mobiles", icon: Smartphone },
  { label: "Beauty", icon: Sparkles },
  { label: "Electronics", icon: Laptop },
  { label: "Home", icon: Sofa },
];

type Item = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  ratings: number;
  category: string;
};

const ITEMS: Item[] = [
  {
    id: "1",
    name: "vivo V50 5G (Rose Red, 128 GB)",
    image: pPhoneRed,
    price: 899,
    oldPrice: 36999,
    discount: 98,
    rating: 4.5,
    ratings: 2813,
    category: "Mobiles",
  },
  {
    id: "2",
    name: "Magnum by Safari Hard Trolley Set of 3",
    image: pLuggage,
    price: 699,
    oldPrice: 4799,
    discount: 85,
    rating: 4.5,
    ratings: 6757,
    category: "Home",
  },
  {
    id: "3",
    name: "GREEN SOUL Kiev Orthopedic Office Chair",
    image: pChair,
    price: 478,
    oldPrice: 6999,
    discount: 93,
    rating: 4.5,
    ratings: 8908,
    category: "Home",
  },
  {
    id: "4",
    name: "Samsung 189 L Direct Cool Refrigerator",
    image: pFridge,
    price: 1499,
    oldPrice: 13998,
    discount: 89,
    rating: 4.5,
    ratings: 7721,
    category: "Electronics",
  },
  {
    id: "5",
    name: "Apple iPhone 16 Pro (Orange Titanium, 256 GB)",
    image: pPhoneOrange,
    price: 1999,
    oldPrice: 119900,
    discount: 98,
    rating: 4.6,
    ratings: 12480,
    category: "Mobiles",
  },
  {
    id: "6",
    name: "Samsung 80 cm HD Ready Smart LED TV",
    image: pTv,
    price: 1299,
    oldPrice: 15990,
    discount: 91,
    rating: 4.4,
    ratings: 9345,
    category: "Electronics",
  },
];

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}.00`;

function HomePage() {
  const { session } = useSession();
  const [tab, setTab] = useState("For You");
  const [slide, setSlide] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(9 * 60 + 13);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setSecondsLeft((s) => (s <= 0 ? 9 * 60 + 13 : s - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: slide * el.clientWidth, behavior: "smooth" });
  }, [slide]);

  const items = useMemo(
    () => (tab === "For You" ? ITEMS : ITEMS.filter((i) => i.category === tab)),
    [tab],
  );

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-surface pb-6">
      <header className="sticky top-0 z-20 bg-gradient-to-b from-sky-200 to-sky-100">
        <div className="mx-auto max-w-md px-3 pt-3">
          <div className="flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-3 shadow-sm">
              <ImageIcon className="h-5 w-5 text-gold-foreground" aria-hidden />
              <span className="text-base font-extrabold italic text-gold-foreground">
                ShopKart
              </span>
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-background py-3 shadow-sm">
              <Plane className="h-5 w-5 text-destructive" aria-hidden />
              <span className="text-base font-extrabold italic text-foreground">Travel</span>
            </button>
          </div>

          <label className="mt-3 mb-3 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-brand" aria-hidden />
            <input
              type="search"
              placeholder="Search for Product"
              aria-label="Search for Product"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-md">
        <h1 className="sr-only">ShopKart online shopping</h1>

        <nav
          className="flex gap-6 overflow-x-auto bg-background px-4 pt-4"
          aria-label="Categories"
        >
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const on = tab === label;
            return (
              <button
                key={label}
                onClick={() => setTab(label)}
                className="flex shrink-0 flex-col items-center gap-1.5 pb-2"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    on ? "bg-brand/10" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-7 w-7 text-foreground" strokeWidth={1.5} aria-hidden />
                </span>
                <span
                  className={`text-[13px] ${on ? "font-bold text-foreground" : "text-foreground/80"}`}
                >
                  {label}
                </span>
                <span
                  className={`h-1 w-full rounded-full ${on ? "bg-brand" : "bg-transparent"}`}
                />
              </button>
            );
          })}
        </nav>

        <section className="bg-surface px-3 py-3" aria-label="Offers">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {BANNERS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Sale offer banner ${i + 1}`}
                width={1200}
                height={608}
                loading={i === 0 ? "eager" : "lazy"}
                className="aspect-[2/1] w-full shrink-0 snap-center rounded-xl object-cover"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {BANNERS.map((src, i) => (
              <button
                key={src}
                aria-label={`Show banner ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  slide === i ? "w-5 bg-brand" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </section>

        <section className="bg-background py-4 text-center" aria-label="Live sale">
          <p className="text-xl font-bold text-foreground">
            Live Sale :{" "}
            <span className="text-price-live">
              {mins}min {String(secs).padStart(2, "0")}sec
            </span>
          </p>
          <p className="mt-1 flex items-center justify-center gap-2 text-base font-semibold text-success">
            <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
            89,450 People watching this sale
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 p-3" aria-label="Products">
          {items.map((p) => (
            <article key={p.id} className="rounded-lg bg-card p-3 shadow-sm">
              <img
                src={p.image}
                alt={p.name}
                width={816}
                height={816}
                loading="lazy"
                className="aspect-square w-full rounded-md bg-background object-contain"
              />
              <h3 className="mt-3 truncate text-[15px] text-card-foreground">{p.name}</h3>
              <p className="mt-1 text-[15px]">
                <span className="font-semibold text-success">{p.discount}% Off</span>{" "}
                <span className="text-muted-foreground line-through">{rupees(p.oldPrice)}</span>
              </p>
              <div className="mt-1 flex items-center justify-between gap-1">
                <span className="text-lg font-bold text-card-foreground">
                  {rupees(p.price)}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-background px-1.5 py-0.5 text-[12px] font-bold italic text-brand">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-black not-italic text-gold-foreground">
                    f
                  </span>
                  Assured
                </span>

              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded bg-success px-1.5 py-0.5 text-xs font-bold text-brand-foreground">
                  {p.rating} <Star className="h-3 w-3 fill-current" aria-hidden />
                </span>
                <span className="text-sm text-muted-foreground">
                  {p.ratings.toLocaleString("en-IN")} Ratings
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground">Free Delivery in Two Days</p>
            </article>
          ))}
        </section>

        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No products in this category yet.
          </p>
        )}

        <div className="px-3 pb-6 text-center">
          <Link to="/auth" className="text-sm font-semibold text-brand">
            {session ? "My Account" : "Login / Sign up"}
          </Link>
        </div>
      </main>
    </div>
  );
}
