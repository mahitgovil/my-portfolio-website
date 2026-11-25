# "What I do" (backup)

The grid of five drawings that Tech stack replaced. Not part of the site. To bring it back, copy `src`
over the site's `src` (PowerShell: `Copy-Item backup/what-i-do/src . -Recurse -Force`), then in
`src/components/Trail.jsx` import `Skills` from "./Skills" and use it instead of `TechStack`.
