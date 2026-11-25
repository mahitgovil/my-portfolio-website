// The content of the About and Experience sections.

export const intro = {
  lead: "I started building for the web in 2022, in my second year of college. Lately I've been building what sits underneath it: my own shell, a P2P BitTorrent system and a mini search engine.",
  offline: "Away from the keyboard you'll find me playing football or badminton, reading, or at the gym.",
  next: "I'm open to jobs where I can contribute, learn and grow. If you have one that fits, I'd like to hear about it.",
};

// top layer first; `art` picks the drawing on the slab (StackSlab in aboutArt.jsx)
export const stack = [
  { name: "Interface", art: "interface", items: ["React", "Next.js", "Flutter"] },
  { name: "Server", art: "server", items: ["Node.js", "Spring Boot"] },
  { name: "Data", art: "data", items: ["MySQL", "PostgreSQL", "MongoDB", "Firebase"] },
  {
    name: "Languages",
    art: "languages",
    items: ["C/C++", "Java", "Python", "Dart", "JavaScript"],
  },
  {
    name: "Foundations",
    art: "foundations",
    items: ["Data structures", "Algorithms", "Git", "GitHub"],
  },
];

// oldest first: the route runs down to whatever comes next. `art` is a drawing in aboutArt.jsx.
export const experience = [
  {
    art: "board",
    date: "May to July 2023",
    role: "Engineer Trainee",
    place: "Central Electronics Limited (CEL)",
    text: "Hands-on training in electronic system design, testing and project execution.",
    tech: [],
  },
  {
    art: "speech",
    date: "March to October 2024",
    role: "Software Intern (Full Stack)",
    place: "Daira Edtech",
    text: "Implemented DeepSpeech, an open-source speech-to-text model, to improve how audio was transcribed.",
    tech: ["Python", "Python APIs", "React", "Git", "DeepSpeech"],
  },
];
