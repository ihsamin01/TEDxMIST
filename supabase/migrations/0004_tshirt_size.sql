-- The payment step now asks for a T-shirt size.
--
-- Required. Until this runs, every registration fails to save, because the
-- form sends a column the table does not have.
--
-- Nullable on purpose: rows registered before this existed genuinely have no
-- size, and a default would invent one for them. The form requires it, so
-- everything from here on is filled in.

alter table public.registrations add column if not exists tshirt_size text;

comment on column public.registrations.tshirt_size is
  'T-shirt size chosen at registration. Null for rows created before this column existed.';
