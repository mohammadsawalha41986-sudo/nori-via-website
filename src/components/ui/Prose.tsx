import clsx from 'clsx';

/**
 * Renders CMS plain-text/newline content as paragraphs. Text is inserted as
 * React children, never as HTML, so authored content cannot inject markup.
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (!paragraphs.length) return null;

  return (
    <div className={clsx('prose-noriva', className)}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split('\n').map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
