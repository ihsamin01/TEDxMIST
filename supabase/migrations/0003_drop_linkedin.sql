-- The form no longer asks for a LinkedIn profile, only Facebook.
--
-- Optional. The site works without running this: the column is nullable and
-- nothing writes to it any more. Run it to stop carrying a dead column, and
-- to keep the table matching what the form collects.

alter table public.registrations drop column if exists linkedin;
