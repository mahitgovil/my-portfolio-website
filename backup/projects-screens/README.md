# Projects, "screens" version (backup)

Every project is a tilted screen that turns to face you. Not part of the site.

To restore it, commit your work, then run this in PowerShell from the `frontend` folder. It replaces
`Projects.jsx` and `Projects.css`; the projects themselves stay in `src/data/projects.js`.

`Copy-Item backup/projects-screens/src . -Recurse -Force`
