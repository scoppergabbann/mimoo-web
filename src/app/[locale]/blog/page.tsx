import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SimplePageHeader } from '@/components/sections/SimplePageHeader';
import { getAllPosts } from '@/lib/blog/posts';
import type { BlogCategory } from '@/lib/blog/posts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('BlogPage');
  const posts = getAllPosts();
  const categories = t.raw('categories') as Record<BlogCategory, string>;

  const categoryColors: Record<
    BlogCategory,
    'purple' | 'pink' | 'blue' | 'green'
  > = {
    stories: 'purple',
    tips: 'blue',
    updates: 'green',
    culture: 'pink',
  };

  return (
    <>
      <SimplePageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('badge')}
        blobExpression="sparkle"
      />

      <section className="py-12 lg:py-16 bg-mimoo-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-5">
            {posts.map((post) => {
              const title = post.title[locale as 'id' | 'en'];
              const excerpt = post.excerpt[locale as 'id' | 'en'];
              const dateStr = new Date(post.publishedAt).toLocaleDateString(
                locale === 'id' ? 'id-ID' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}` as never}
                  className="group block"
                >
                  <Card
                    variant="default"
                    className="h-full transition-all duration-200 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:shadow-soft-lg"
                  >
                    {/* Cover emoji */}
                    <div className="aspect-[16/9] rounded-cozy bg-gradient-cozy flex items-center justify-center mb-4 text-6xl">
                      <span aria-hidden="true">{post.coverEmoji}</span>
                    </div>

                    {/* Category + read time */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={categoryColors[post.category]} size="sm">
                        {categories[post.category]}
                      </Badge>
                      <span className="text-xs text-mimoo-ink-300">
                        {post.readTimeMinutes} {t('minRead')}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-bold text-mimoo-ink-900 mb-2 leading-snug group-hover:text-mimoo-purple-700 transition-colors">
                      {title}
                    </h2>

                    <p className="text-sm text-mimoo-ink-500 leading-relaxed mb-4 line-clamp-3">
                      {excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-mimoo-ink-300 pt-3 border-t border-mimoo-purple-50">
                      <span>
                        {t('by')} <strong className="text-mimoo-ink-700">{post.author}</strong>
                      </span>
                      <span>{dateStr}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
