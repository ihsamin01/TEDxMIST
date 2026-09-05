Speaker photographs go in this folder.

Name each file after the speaker, in lowercase with dashes:

  ayesha-rahman.jpg
  rashed-noman.jpg

Then point at it from `src/config/event.ts`, with a leading slash:

  photo: "/speakers/ayesha-rahman.jpg",

Square images around 800x800 work best. The cards crop to a circle, so
anything very wide or very tall loses the sides.

A speaker with no `photo` line shows their initials on a red gradient
instead, which looks deliberate. An unconfirmed photo is not a problem.
