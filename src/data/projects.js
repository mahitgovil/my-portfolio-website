// All the content of the Projects section lives here. To add a project, add one entry.
//
//   id           unique slug. Also the thumbnail name: public/assets/projects/<id>-640.avif / -960.avif
//                (and .webp). See "Adding a thumbnail" in the notes at the bottom of this file.
//   name, type   type must be one of the filter names in Projects.jsx ("Web Development", ...)
//   description  one or two sentences, shown on hover (desktop) / under the image (touch)
//   tech         short list of technologies, shown as chips. Can be empty.
//   imagePosition optional CSS object-position for the thumbnail (default "center"). The tile shape
//                changes with screen width, so this decides which side of the image survives the crop.
//   status       optional badge: "live" | "open-source" | "in-progress" | "private"
//   websiteLink  live demo URL ("" if none)
//   githubLink   source code URL ("" if none)
//
// Descriptions and tech lists were written from each project's GitHub README and package.json.

export const projects = [
  {
    id: "stackoverflow-clone",
    imagePosition: "left center",
    name: "Stackoverflow Clone",
    type: "Web Development",
    description:
      "A Stack Overflow-style Q&A platform: React and Redux front end, Node.js and Express API on MySQL.",
    tech: ["React", "Redux", "Node.js", "Express", "MySQL", "Sass"],
    status: "live",
    websiteLink: "https://stackoverflow-clone-client.vercel.app/",
    githubLink: "https://github.com/mahitgovil/Stackoverflow-Clone",
  },
  {
    id: "sudoku-solver",
    imagePosition: "30% center",
    name: "Sudoku Solver",
    type: "Web Development",
    description:
      "Solves Sudoku boards with a backtracking algorithm and can visualise every step of the solution.",
    tech: ["React", "Bootstrap", "Backtracking"],
    status: "live",
    websiteLink: "https://sudoku-solver-nine.vercel.app/",
    githubLink: "https://github.com/mahitgovil/Sudoku-Solver",
  },
  {
    id: "notes-keeper",
    imagePosition: "left center",
    name: "Notes Keeper",
    type: "Web Development",
    description:
      "A Google Keep-inspired notes app. Notes are stored in your browser, so they stay on your device.",
    tech: ["React", "LocalStorage", "CSS"],
    status: "live",
    websiteLink: "https://mahitgovil.github.io/Notes-Keeper/",
    githubLink: "https://github.com/mahitgovil/Notes-Keeper",
  },
  {
    id: "chat-app",
    name: "Chat App",
    type: "App Dev",
    // TODO: add the real tech stack, a status badge and a repo / demo link for this project.
    // The description below only reflects what the screenshot shows (email + Google sign-in).
    description: "A chat app with email and Google sign-in.",
    tech: [],
    websiteLink: "",
    githubLink: "",
  },
  {
    id: "plant-disease-prediction",
    imagePosition: "left center",
    name: "Plant Disease Prediction",
    type: "Machine Learning",
    description:
      "Upload a photo of a plant leaf and an ML model identifies the disease, through a Streamlit app.",
    tech: ["Python", "TensorFlow", "Streamlit", "NumPy"],
    status: "open-source",
    websiteLink: "",
    githubLink: "https://github.com/mahitgovil/Plant-disease-prediction",
  },
  {
    id: "todo-list",
    name: "ToDo List",
    type: "App Dev",
    description: "A to-do list app built end to end on the MERN stack.",
    tech: ["MongoDB", "Express", "React", "Node.js"],
    status: "open-source",
    websiteLink: "",
    githubLink: "https://github.com/mahitgovil/ToDo-List",
  },
  {
    id: "movie-review-app",
    imagePosition: "left center",
    name: "Movie Review App",
    type: "Web Development",
    description:
      "A movie review app: a Java Spring Boot API with MongoDB, and a React front end.",
    tech: ["React", "Java", "Spring Boot", "MongoDB"],
    status: "open-source",
    websiteLink: "",
    githubLink: "https://github.com/mahitgovil/movie-review-app",
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop Website",
    type: "Web Development",
    description: "A responsive landing page for a coffee shop.",
    tech: ["HTML", "CSS", "JavaScript"],
    status: "live",
    websiteLink: "https://mahitgovil.github.io/coffee-shop-website/",
    githubLink: "https://github.com/mahitgovil/coffee-shop-website",
  },
];

// Adding a thumbnail
// ------------------
// Crop the screenshot to 4:3 and export it as <id>-640 and <id>-960 in AVIF and WebP into
// public/assets/projects/. (The existing ones were made with the `sharp` library; any image
// tool such as squoosh.app works too.) Keep it light: each file should be well under 100 KB.
