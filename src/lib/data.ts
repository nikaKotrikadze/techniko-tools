import { createPublicClient } from "@/lib/supabase/public";

export type PricingType = "free" | "freemium" | "paid";
export type Category = { id: number; name: string; slug: string; icon: string | null };

export type Tool = {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  website_url: string;
  affiliate_url: string | null;
  logo_url: string | null;
  pricing_type: PricingType;
  price_note: string | null;
  rating: number | null;
  verdict: string | null;
  reel_url: string | null;
  category_id: number | null;
  is_featured: boolean;
  featured_until: string | null;
  published: boolean;
  created_at: string;
  category: Pick<Category, "name" | "slug" | "icon"> | null;
  tags: string[];
  /** Featured and not expired. Every place showing this must say "Sponsored". */
  sponsored: boolean;
};

type ToolRow = Omit<Tool, "tags" | "sponsored"> & { tool_tags: { tags: { name: string } | null }[] };

export const PRICING_LABEL: Record<PricingType, string> = { free: "Free", freemium: "Freemium", paid: "Paid" };

export async function getPublishedTools(): Promise<Tool[]> {
  const { data, error } = await createPublicClient()
    .from("tools")
    .select("*, category:categories(name, slug, icon), tool_tags(tags(name))")
    .eq("published", true)
    .order("rating", { ascending: false, nullsFirst: false })
    .order("name");
  if (error) throw new Error(`Loading tools failed: ${error.message}`);

  const today = new Date().toISOString().slice(0, 10);
  return (data as ToolRow[]).map(({ tool_tags, ...t }) => ({
    ...t,
    tags: tool_tags.flatMap((tt) => (tt.tags ? [tt.tags.name] : [])),
    sponsored: t.is_featured && (!t.featured_until || t.featured_until >= today),
  }));
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await createPublicClient().from("categories").select("*").order("name");
  if (error) throw new Error(`Loading categories failed: ${error.message}`);
  return data;
}
