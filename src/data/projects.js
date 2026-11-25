// All the content of the Projects section lives here. To add a project, add one entry.
//
//   id           unique slug. Also the thumbnail name: public/assets/projects/<id>-640.avif / -960.avif
//                (and .webp). See "Adding a thumbnail" in the notes at the bottom of this file.
//   name
//   featured     shown large
//   lightImage   there is also a <id>-light-640 / -960 screenshot, shown in the light theme
//   art          a drawing from workArt.jsx, for projects without a screenshot
//   description  one short sentence
//   tech         short list of technologies. Can be empty.
//   imagePosition optional CSS object-position for the thumbnail (default "center"). The tile shape
//                changes with screen width, so this decides which side of the image survives the crop.
//   websiteLink  live demo URL ("" if none)
//   githubLink   source code URL ("" if none)
//
// Descriptions and tech lists were written from each project's GitHub README and package.json.

export const projects = [
  {
    id: "atlas-search",
    lightImage: true,
    name: "Atlas Search",
    featured: true,
    description: "A full-text search engine, written from scratch.",
    tech: ["C++20", "React", "TypeScript"],
    websiteLink: "",
    githubLink: "",
  },
  {
    id: "cinematch",
    name: "CineMatch",
    featured: true,
    description: "A movie recommender that learns from what you like.",
    tech: ["React", "TypeScript", "FastAPI", "scikit-learn"],
    websiteLink: "",
    githubLink: "",
  },
  {
    id: "netwatch",
    lightImage: true,
    name: "NetWatch",
    featured: true,
    description: "Monitors a home network and shows which layer is broken.",
    tech: ["Python", "SQLite"],
    websiteLink: "",
    githubLink: "",
  },
  {
    id: "shell",
    name: "Shell",
    featured: true,
    art: "shell",
    // TODO: add the tech, links and a screenshot
    description: "My own command-line shell.",
    tech: [],
    websiteLink: "",
    githubLink: "",
  },
  {
    id: "bittorrent",
    name: "P2P BitTorrent",
    featured: true,
    art: "net",
    // TODO: add the tech, links and a screenshot
    description: "Peer-to-peer file sharing.",
    tech: [],
    websiteLink: "",
    githubLink: "",
  },
  {
    id: "stackoverflow-clone",
    imagePosition: "left center",
    name: "Stackoverflow Clone",
    description:
      "A Q&A platform with accounts, questions and votes.",
    tech: ["React", "Redux", "Node.js", "Express", "MySQL", "Sass"],
    websiteLink: "https://stackoverflow-clone-client.vercel.app/",
    githubLink: "https://github.com/mahitgovil/Stackoverflow-Clone",
  },
  {
    id: "sudoku-solver",
    imagePosition: "30% center",
    name: "Sudoku Solver",
    description:
      "Solves Sudoku and shows every step.",
    tech: ["React", "Bootstrap", "Backtracking"],
    websiteLink: "https://sudoku-solver-nine.vercel.app/",
    githubLink: "https://github.com/mahitgovil/Sudoku-Solver",
  },
  {
    id: "plant-disease-prediction",
    imagePosition: "left center",
    name: "Plant Disease Prediction",
    description:
      "Identifies plant diseases from a photo of a leaf.",
    tech: ["Python", "TensorFlow", "Streamlit", "NumPy"],
    websiteLink: "",
    githubLink: "https://github.com/mahitgovil/Plant-disease-prediction",
  },
];

// Adding a thumbnail
// ------------------
// Crop the screenshot to 4:3 and export it as <id>-640 and <id>-960 in AVIF and WebP into
// public/assets/projects/. (The existing ones were made with the `sharp` library; any image
// tool such as squoosh.app works too.) Keep it light: each file should be well under 100 KB.
