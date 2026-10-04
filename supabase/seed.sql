-- Example data. Ratings and verdicts are placeholders: replace them with your real reviews.

insert into public.categories (name, slug, icon) values
  ('Writing', 'writing', '✍️'),
  ('Image', 'image', '🎨'),
  ('Video', 'video', '🎬'),
  ('Coding', 'coding', '💻'),
  ('Productivity', 'productivity', '⚡');

insert into public.tags (name, slug) values
  ('Free plan', 'free-plan'),
  ('Beginner friendly', 'beginner-friendly'),
  ('For creators', 'for-creators'),
  ('Mobile app', 'mobile-app');

insert into public.tools
  (name, slug, tagline, description, website_url, pricing_type, price_note, rating, verdict, category_id, is_featured, published)
select v.name, v.slug, v.tagline, v.description, v.website_url, v.pricing_type::public.pricing_type, v.price_note,
       v.rating, v.verdict, c.id, v.is_featured, v.published
from (values
  ('Claude', 'claude', 'AI assistant for writing, research, and code', 'Placeholder description. Replace with your review notes.', 'https://claude.ai', 'freemium', 'Free plan + paid tiers', 4.5, 'Placeholder verdict.', 'writing', true, true),
  ('ChatGPT', 'chatgpt', 'General-purpose AI chat assistant', 'Placeholder description. Replace with your review notes.', 'https://chatgpt.com', 'freemium', 'Free plan + paid tiers', 4.5, 'Placeholder verdict.', 'writing', false, true),
  ('Midjourney', 'midjourney', 'High-quality AI image generation', 'Placeholder description. Replace with your review notes.', 'https://www.midjourney.com', 'paid', 'Paid plans only', 4.5, 'Placeholder verdict.', 'image', false, true),
  ('Ideogram', 'ideogram', 'AI images with readable text', 'Placeholder description. Replace with your review notes.', 'https://ideogram.ai', 'freemium', 'Free credits + paid tiers', 4.0, 'Placeholder verdict.', 'image', false, true),
  ('Runway', 'runway', 'AI video generation and editing', 'Placeholder description. Replace with your review notes.', 'https://runwayml.com', 'freemium', 'Free credits + paid tiers', 4.0, 'Placeholder verdict.', 'video', true, true),
  ('CapCut', 'capcut', 'Video editor with AI captions and effects', 'Placeholder description. Replace with your review notes.', 'https://www.capcut.com', 'freemium', 'Free plan + Pro', 4.0, 'Placeholder verdict.', 'video', false, true),
  ('Cursor', 'cursor', 'AI-first code editor', 'Placeholder description. Replace with your review notes.', 'https://cursor.com', 'freemium', 'Free plan + paid tiers', 4.5, 'Placeholder verdict.', 'coding', false, true),
  ('Bolt', 'bolt', 'Build web apps from a prompt', 'Placeholder description. Replace with your review notes.', 'https://bolt.new', 'freemium', 'Free tokens + paid tiers', 3.5, 'Placeholder verdict.', 'coding', false, true),
  ('Notion AI', 'notion-ai', 'AI built into your notes and docs', 'Placeholder description. Replace with your review notes.', 'https://www.notion.com', 'freemium', 'Add-on to Notion plans', 4.0, 'Placeholder verdict.', 'productivity', false, true),
  ('Otter', 'otter', 'AI meeting notes and transcripts', 'Placeholder description. Replace with your review notes.', 'https://otter.ai', 'freemium', 'Free plan + paid tiers', 3.5, 'Placeholder verdict.', 'productivity', false, false) -- draft: hidden from the public
) as v(name, slug, tagline, description, website_url, pricing_type, price_note, rating, verdict, category_slug, is_featured, published)
join public.categories c on c.slug = v.category_slug;

insert into public.tool_tags (tool_id, tag_id)
select t.id, g.id
from (values
  ('claude', 'free-plan'), ('claude', 'beginner-friendly'), ('claude', 'mobile-app'),
  ('chatgpt', 'free-plan'), ('chatgpt', 'beginner-friendly'), ('chatgpt', 'mobile-app'),
  ('ideogram', 'free-plan'), ('ideogram', 'for-creators'),
  ('midjourney', 'for-creators'),
  ('runway', 'for-creators'),
  ('capcut', 'free-plan'), ('capcut', 'for-creators'), ('capcut', 'mobile-app'),
  ('cursor', 'free-plan'),
  ('bolt', 'beginner-friendly'),
  ('notion-ai', 'mobile-app'),
  ('otter', 'free-plan')
) as v(tool_slug, tag_slug)
join public.tools t on t.slug = v.tool_slug
join public.tags g on g.slug = v.tag_slug;
