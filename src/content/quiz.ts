/**
 * The on-page Royal Assessment's question bank (brief Appendix B), rebuilt
 * on works that are in Narsil's catalog and on this site: the Met's famous
 * works in the brief's starter bank aren't in the catalog, so their
 * questions use Cleveland and Rijksmuseum works instead. Questions 2, 6, 7
 * and 9 are the brief's own. Every fact matches the museum's record (title,
 * date, medium in artworks.json).
 *
 * Captions and facts appear only after the visitor answers.
 */
export type QuizQuestion =
  | { style: "who"; slug: string; prompt: string; options: string[]; answer: number; fact: string }
  | { style: "older"; slugs: [string, string]; prompt: string; answer: 0 | 1; fact: string }
  | { style: "truefalse"; slug: string; prompt: string; statement: string; answer: boolean; fact: string };

export const QUIZ_LENGTH = 5;

export const QUIZ_BANK: QuizQuestion[] = [
  {
    style: "who",
    slug: "cezanne-sainte-victoire",
    prompt: "Who painted this?",
    options: ["Vincent van Gogh", "Claude Monet", "Paul Cézanne", "Paul Gauguin"],
    answer: 2,
    fact: "Cézanne painted this mountain near his home in Aix-en-Provence again and again, in oil and watercolour, for more than twenty years.",
  },
  {
    style: "who",
    slug: "milkmaid",
    prompt: "Who painted this?",
    options: ["Johannes Vermeer", "Rembrandt van Rijn", "Frans Hals", "Jan Steen"],
    answer: 0,
    fact: "Fewer than 40 paintings are attributed to Vermeer.",
  },
  {
    style: "truefalse",
    slug: "hokusai-south-wind",
    prompt: "True or false?",
    statement: "Hokusai's Red Fuji is an oil painting.",
    answer: false,
    fact: "It's a colour woodblock print from Thirty-Six Views of Mount Fuji. Many impressions were printed, which is why several museums own one.",
  },
  {
    style: "older",
    slugs: ["night-watch", "lippi-holy-family"],
    prompt: "Which was painted first?",
    answer: 1,
    fact: "Filippino Lippi's Holy Family is about 150 years older than Rembrandt's militia company.",
  },
  {
    style: "who",
    slug: "jewish-bride",
    prompt: "Who painted this?",
    options: ["Johannes Vermeer", "Rembrandt van Rijn", "Frans Hals", "Jan Steen"],
    answer: 1,
    fact: "Its nickname, The Jewish Bride, dates from the 19th century. Today the couple is thought to be Isaac and Rebecca.",
  },
  {
    style: "truefalse",
    slug: "night-watch",
    prompt: "True or false?",
    statement: "“The Night Watch” is the painting's original title.",
    answer: false,
    fact: "Its official title is Militia Company of District II under the Command of Captain Frans Banninck Cocq.",
  },
  {
    style: "who",
    slug: "turner-burning-parliament",
    prompt: "Who painted this?",
    options: ["J. M. W. Turner", "John Constable", "Caspar David Friedrich", "Thomas Cole"],
    answer: 0,
    fact: "Turner watched the 1834 fire himself and painted it the next year.",
  },
  {
    style: "older",
    slugs: ["turner-burning-parliament", "hokusai-south-wind"],
    prompt: "Which was made first?",
    answer: 1,
    fact: "A close call: Hokusai's print came out a few years before Turner painted the fire.",
  },
  {
    style: "truefalse",
    slug: "monet-water-lilies",
    prompt: "True or false?",
    statement: "Monet painted his water lilies from a pond in his own garden.",
    answer: true,
    fact: "He had the pond dug at his home in Giverny and painted it for the rest of his life.",
  },
  {
    style: "who",
    slug: "avercamp-skaters",
    prompt: "Who painted this?",
    options: ["Pieter Bruegel the Elder", "Hendrick Avercamp", "Jacob van Ruisdael", "Aelbert Cuyp"],
    answer: 1,
    fact: "Avercamp painted winter on the ice again and again. He was deaf, and was known as “the Mute of Kampen”.",
  },
];

export const quizSlugs = (q: QuizQuestion): string[] => (q.style === "older" ? q.slugs : [q.slug]);
