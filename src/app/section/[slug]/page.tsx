import { getCategoryBySlug, getArticlesByCategory } from '@/lib/data';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BreakingNews from '@/components/ui/BreakingNews';
import ArticleCard from '@/components/ui/ArticleCard';

export const dynamic = 'force-dynamic';

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) {
    return <div className="p-8 text-center text-red-500">Error: No slug provided</div>;
  }

  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-xl text-gray-600">القسم غير موجود: {slug}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const articles = getArticlesByCategory(category.id);
  const topArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <>
      <Header />
      <BreakingNews title={`قسم ${category.name} — آخر الأخبار`} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-secondary)] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-4">{category.name}</h1>
            {category.description && <p className="text-xl text-white/80">{category.description}</p>}
            <p className="text-sm text-white/60 mt-4">{articles.length} مقال منشور</p>
          </div>
        </section>

        {topArticle && (
          <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">المقال الرئيسي</h2>
              <ArticleCard article={topArticle} variant="featured" />
            </div>
          </section>
        )}

        {otherArticles.length > 0 && (
          <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-display)]">جميع المقالات</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </section>
        )}

        {articles.length === 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-500 text-lg">لا توجد مقالات في هذا القسم بعد</p>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
