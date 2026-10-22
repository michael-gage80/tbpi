import { cn } from "@/lib/utils";

type SplitTag = "h1" | "h2" | "h3" | "p" | "span";

interface SplitTextProps {
  text: string;
  as?: SplitTag;
  /** Phrase within `text` to set in italic orange */
  accent?: string;
  /** "load" animates on first paint (heroes); "view" when scrolled into view */
  trigger?: "load" | "view";
  /** Seconds before the first word moves */
  delay?: number;
  className?: string;
  id?: string;
}

// Masked word-by-word reveal. Renders plain markup (no client JS of its own): the
// CSS in globals.css animates `.sw-i` and Interactions adds `.is-in` for "view".
// "\n" in `text` forces a line break.
export function SplitText({
  text,
  as: Tag = "h2",
  accent,
  trigger = "view",
  delay = 0,
  className,
  id,
}: SplitTextProps) {
  const lines = text.split("\n").map((line) => line.split(/\s+/).filter(Boolean));
  const accentWords = accent ? accent.split(/\s+/) : [];

  // Index of every word that falls inside the accent phrase.
  const flat = lines.flat();
  const accented = new Set<number>();
  if (accentWords.length) {
    for (let i = 0; i + accentWords.length <= flat.length; i++) {
      const match = accentWords.every((w, j) => stripPunctuation(flat[i + j]) === stripPunctuation(w));
      if (match) accentWords.forEach((_, j) => accented.add(i + j));
    }
  }

  let index = 0;
  return (
    <Tag
      id={id}
      className={cn("split", className)}
      data-split={trigger}
      data-reveal={trigger === "view" ? "split" : undefined}
      style={delay ? ({ "--d": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {lines.map((words, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {words.map((word, wi) => {
            const i = index++;
            return (
              <span key={wi}>
                <span className="sw">
                  <span className="sw-i" style={{ "--i": i } as React.CSSProperties}>
                    {accented.has(i) ? <em className="accent">{word}</em> : word}
                  </span>
                </span>
                {wi < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

function stripPunctuation(word: string) {
  return word.replace(/[.,;:!?]+$/, "").toLowerCase();
}
