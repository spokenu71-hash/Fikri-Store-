-- Fikri Store: allow display prices such as "3 jutaan", "Hubungi kami", and "Gratis".
-- Safe conversion: existing numeric prices are preserved as text.
alter table public.products
  alter column price type text
  using price::text;

comment on column public.products.price is
  'Display price entered by the administrator; may contain a number or a text label.';
