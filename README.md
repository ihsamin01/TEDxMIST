# TEDxMIST

Website for TEDxMIST 2026, an independently organized TEDx event at the
Military Institute of Science and Technology, Dhaka.

**Theme:** Echoes of Tomorrow
**Date:** 19 November 2026

Built with Next.js and Tailwind.
Open https://tedxmist.vercel.app/





## Opening and closing registration

There is an Open / Close control at the bottom of `/admin`. The switch lives in
the database, so it takes effect straight away with no code change and no
redeploy.

Closing does not take anything off the site. The layout, the sections and the
seat buttons all stay exactly where they were. The countdown sits at zero, the
label above it reads "Registration closed", and pressing a seat button raises a
floating notice instead of opening the form. The server refuses submissions
too, so a stale page cannot sneak one through.

Run `supabase/migrations/0006_settings.sql` once before using it. Until that
table exists the site falls back to `registration.isOpen` in
`src/config/event.ts` and the switch has nowhere to write.
