import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  old_price: number | null;
  discount: number;
  rating: number;
  ratings_count: number;
  assured: boolean;
  featured: boolean;
};

export const getProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const supabase = createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,brand,category,price,old_price,discount,rating,ratings_count,assured,featured",
    )
    .order("discount", { ascending: false });

  if (error) {
    console.error("products read failed", error.message);
    return [];
  }

  return (data ?? []) as Product[];
});
