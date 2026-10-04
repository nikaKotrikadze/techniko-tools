import { cache } from "react";
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

// Every public tool query goes through here, so drafts can never leak even if RLS changed.
function publishedTools() {
  return createPublicClient()
    .from("tools")
    .select("*, category:categories(name, slug, icon), tool_tags(tags(name))")
    .eq("published", true)
    .order("rating", { ascending: false, nullsFirst: false })
    .order("name");
}

function toTool({ tool_tags, ...t }: ToolRow): Tool {
  const today = new Date().toISOString().slice(0, 10);
  return {
    ...t,
    tags: tool_tags.flatMap((tt) => (tt.tags ? [tt.tags.name] : [])),
    sponsored: t.is_featured && (!t.featured_until || t.featured_until >= today),
  };
}

export async function getPublishedTools(): Promise<Tool[]> {
  const { data, error } = await publishedTools();
  if (error) throw new Error(`Loading tools failed: ${error.message}`);
  return (data as ToolRow[]).map(toTool);
}

// cache(): generateMetadata and the page share one query per request.
export const getTool = cache(async (slug: string): Promise<Tool | null> => {
  const { data, error } = await publishedTools().eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Loading tool failed: ${error.message}`);
  return data ? toTool(data as ToolRow) : null;
});

export async function getRelatedTools(tool: Tool, limit = 3): Promise<Tool[]> {
  if (tool.category_id === null) return [];
  const { data, error } = await publishedTools().eq("category_id", tool.category_id).neq("id", tool.id).limit(limit);
  if (error) throw new Error(`Loading related tools failed: ${error.message}`);
  return (data as ToolRow[]).map(toTool);
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await createPublicClient().from("categories").select("*").order("name");
  if (error) throw new Error(`Loading categories failed: ${error.message}`);
  return data;
}
