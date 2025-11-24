// assetMapper.js
const ALIASES = {
  // common plural -> singular / synonyms
  "tables": "tabledesk",
  "table": "tabledesk",
  "tabledesk": "tabledesk",
  "desks": "tabledesk",
  "chairs": "chair",
  "sofas": "lounge_sofa",
  "bookshelves": "bookshelf",
  "shelves": "bookshelf",
  "market table": "desk",
  "bar counter": "desk",
  "bar": "desk",
  "workbench": "desk",
  "cabinet": "cabinet",
  "bed": "bed",
  "lamp": "lamp",
  "rug": "rug",
  "bottle": "bottle",
  "weapon": "weapon",
  "magnifying glass": "magnifying_glass",

  // NPCs -> no asset (characters might map to 'character' later)
  "edgar flint": "character",
  "lydia brasslight": "character"
  // add more aliases as you discover names
};

export function normalizeName(rawName = "") {
  if (!rawName) return "";
  const s = rawName.toString().trim().toLowerCase();
  // remove punctuation
  const cleaned = s.replace(/[^\w\s]/g, "");
  // try direct alias
  if (ALIASES[cleaned]) return ALIASES[cleaned];
  // try last word (e.g., "round tables" -> "tables")
  const last = cleaned.split(/\s+/).slice(-1)[0];
  if (ALIASES[last]) return ALIASES[last];
  // fallback: return exact cleaned (so caller can lookup registry)
  return cleaned;
}
