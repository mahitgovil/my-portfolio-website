# Nebula landing screen (backup)

The earlier landing screen: the name condenses out of a nebula, with a small swarm in front of it.
Nothing in here is part of the site; it is neither built nor deployed.

To restore it, from the `frontend` folder:

1. Commit your work first. The copy replaces `Hero.jsx`, `hero.css` and `index.html`, so later edits
   to those three (the text under the name, for example) need redoing.
2. Copy everything over in PowerShell:
   `Copy-Item backup/nebula-hero/index.html, backup/nebula-hero/public, backup/nebula-hero/src . -Recurse -Force`
3. `heroMachines.js` and `isoView.js` in `src/components` are then unused and can be deleted.

The nebula photo is from ESO. Its licence asks for a visible credit on the page.

The nebula is dark in both themes. Copying `index.html` also drops the script that applies the saved
theme before the first paint, so put that back from git.
