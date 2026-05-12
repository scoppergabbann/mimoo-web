import { Card } from '@/components/ui/Card';

interface LegalSection {
  title: string;
  content: string;
}

interface LegalContentProps {
  intro: string;
  tldrTitle: string;
  tldrItems: string[];
  sections: Record<string, LegalSection>;
  lastUpdated: string;
}

/**
 * Renderer untuk konten legal (privacy policy, terms).
 * Layout standard untuk readability.
 */
export function LegalContent({
  intro,
  tldrTitle,
  tldrItems,
  sections,
  lastUpdated,
}: LegalContentProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Last updated */}
      <p className="text-sm text-mimoo-ink-500 italic mb-6 text-center">
        {lastUpdated}
      </p>

      {/* Intro */}
      <Card variant="default" className="mb-8 p-6">
        <p className="text-mimoo-ink-700 leading-relaxed">{intro}</p>
      </Card>

      {/* TL;DR Card */}
      <Card
        variant="elevated"
        className="mb-10 p-6 bg-gradient-to-br from-mimoo-purple-50 to-mimoo-cream-100 border-2 border-mimoo-purple-200"
      >
        <h2 className="font-display text-xl font-bold text-mimoo-ink-900 mb-3">
          {tldrTitle}
        </h2>
        <ul className="space-y-2">
          {tldrItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-mimoo-ink-700">
              <span className="text-mimoo-purple-500 mt-0.5" aria-hidden="true">
                ✓
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Full sections */}
      <div className="space-y-8">
        {Object.entries(sections).map(([key, section]) => (
          <section key={key} id={key}>
            <h2 className="font-display text-2xl font-bold text-mimoo-ink-900 mb-3">
              {section.title}
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-mimoo-ink-700 leading-relaxed whitespace-pre-wrap">
                {formatBoldText(section.content)}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/**
 * Format **bold** markdown-style ke JSX strong tags.
 * Lightweight inline formatter — gak perlu full markdown parser.
 */
function formatBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-mimoo-ink-900">
          {inner}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
