import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getPostBySlug, getAllPosts } from '@/lib/blog/posts';
import type { BlogCategory } from '@/lib/blog/posts';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.flatMap((post) => [
    { locale: 'id', slug: post.slug },
    { locale: 'en', slug: post.slug },
  ]);
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };

  const title = post.title[locale as 'id' | 'en'];
  const excerpt = post.excerpt[locale as 'id' | 'en'];

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

/**
 * Lightweight markdown-ish renderer.
 * Supports: paragraph breaks, **bold**, [link text](url), --- horizontal rule
 */
function renderContent(content: string) {
  const parts = content.split('\n\n');
  return parts.map((para, i) => {
    const trimmed = para.trim();

    // Horizontal rule
    if (trimmed === '---') {
      return (
        <hr key={i} className="my-8 border-t-2 border-mimoo-purple-100" />
      );
    }

    // Heading (lines starting with **bold** that look like section titles)
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(' ')) {
      // skip, treat as paragraph
    }

    // Parse inline
    return (
      <p key={i} className="mb-4 leading-relaxed text-mimoo-ink-700">
        {parseInline(trimmed)}
      </p>
    );
  });
}

function parseInline(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  // Match **bold**, [link](url), *italic*, or plain text
  const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // **bold**
      result.push(
        <strong key={key++} className="font-semibold text-mimoo-ink-900">
          {match[1]}
        </strong>
      );
    } else if (match[2] && match[3]) {
      // [link](url)
      result.push(
        <Link
          key={key++}
          href={match[3] as never}
          className="text-mimoo-purple-700 hover:text-mimoo-purple-900 font-semibold hover:underline"
        >
          {match[2]}
        </Link>
      );
    } else if (match[4]) {
      // *italic*
      result.push(
        <em key={key++} className="italic text-mimoo-ink-500">
          {match[4]}
        </em>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations('BlogPage');
  const tCat = t.raw('categories') as Record<BlogCategory, string>;

  const title = post.title[locale as 'id' | 'en'];
  const content = post.content[locale as 'id' | 'en'];
  const authorRole = post.authorRole[locale as 'id' | 'en'];
  const dateStr = new Date(post.publishedAt).toLocaleDateString(
    locale === 'id' ? 'id-ID' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const categoryColors: Record<
    BlogCategory,
    'purple' | 'pink' | 'blue' | 'green'
  > = {
    stories: 'purple',
    tips: 'blue',
    updates: 'green',
    culture: 'pink',
  };

  // Related posts (same category, exclude current)
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-cozy py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-mimoo-purple-700 hover:text-mimoo-purple-900 font-medium hover:underline mb-6"
          >
            ← Blog
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge variant={categoryColors[post.category]} size="sm">
                {tCat[post.category]}
              </Badge>
              <span className="text-xs text-mimoo-ink-500">
                {post.readTimeMinutes} {t('minRead')}
              </span>
            </div>

            <div className="text-7xl mb-4" aria-hidden="true">
              {post.coverEmoji}
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-mimoo-ink-900 mb-4 leading-tight">
              {title}
            </h1>

            <p className="text-sm text-mimoo-ink-500">
              {t('by')} <strong className="text-mimoo-ink-900">{post.author}</strong> · {authorRole} · {dateStr}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">{renderContent(content)}</div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 bg-mimoo-cream-100 border-t border-mimoo-purple-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-mimoo-ink-900 mb-6">
              {locale === 'id' ? 'Baca juga' : 'Read also'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}` as never} className="block group">
                  <Card variant="default" className="h-full transition-all motion-safe:group-hover:-translate-y-1">
                    <div className="text-4xl mb-2" aria-hidden="true">
                      {rel.coverEmoji}
                    </div>
                    <h3 className="font-display text-base font-bold text-mimoo-ink-900 mb-2 group-hover:text-mimoo-purple-700 transition-colors">
                      {rel.title[locale as 'id' | 'en']}
                    </h3>
                    <p className="text-sm text-mimoo-ink-500 line-clamp-2">
                      {rel.excerpt[locale as 'id' | 'en']}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
