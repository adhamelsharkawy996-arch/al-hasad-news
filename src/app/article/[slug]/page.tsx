import { getArticleBySlug, getRelatedArticles } from '@/lib/data';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ArticleCard from '@/components/ui/ArticleCard';
import { formatDate } from '@/lib/utils';
import { Calendar, User, Share2, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.id, article.categoryId);

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <section className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            {article.category && (
              <a href={`/section/${article.category.slug}`} className="inline-block text-[var(--color-accent)] font-bold text-sm mb-2 hover:underline">
                {article.category.name}
              </a>
            )}
            <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] leading-tight mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {article.author && (
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {article.author}
                </span>
              )}
              {article.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(article.publishedAt)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Share2 size={14} />
                <button className="hover:text-[var(--color-accent)]">مشاركة</button>
              </span>
            </div>

            {article.featuredImage && (
              <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
                <img src={article.featuredImage} alt={article.title} className="w-full h-auto" />
              </div>
            )}
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            {article.excerpt && (
              <div className="bg-gray-50 border-r-4 border-[var(--color-accent)] p-6 mb-8 rounded-lg">
                <p className="text-lg font-medium leading-relaxed">{article.excerpt}</p>
              </div>
            )}

            <article 
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.category && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                <span className="text-sm">القسم:</span>
                <a href={`/section/${article.category.slug}`} className="text-[var(--color-accent)] font-bold hover:underline">
                  {article.category.name}
                </a>
              </div>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">مقالات ذات صلة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
