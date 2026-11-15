import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import BreakingNews from '@/components/ui/BreakingNews';
import ArticleCard from '@/components/ui/ArticleCard';
import { getBreakingArticles, getLatestArticles, getAllCategories, getArticlesByCategory } from '@/lib/data';
import { Clock, TrendingUp, Globe, Dumbbell, Users, AlertTriangle } from 'lucide-react';

const SECTION_ORDER = ['local-news', 'international-news', 'sports', 'women-society', 'accidents'];

export default function HomePage() {
  const breakingNews = getBreakingArticles();
  const latestArticles = getLatestArticles(8);
  const categories = getAllCategories().sort((a, b) => {
    const aIdx = SECTION_ORDER.indexOf(a.slug);
    const bIdx = SECTION_ORDER.indexOf(b.slug);
    return aIdx - bIdx;
  });
  const topArticle = latestArticles[0];
  const otherArticles = latestArticles.slice(1);

  const sectionIcons: Record<string, any> = {
    'local-news': TrendingUp,
    'international-news': Globe,
    'sports': Dumbbell,
    'women-society': Users,
    'accidents': AlertTriangle,
  };

  return (
    <>
      <Header />
      
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <BreakingNews title={breakingNews.map(a => a.title).join(' • ')} />
      )}

      <main className="flex-1">
        {/* Featured Hero Section */}
        <section className="py-6 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Featured */}
              <div className="lg:col-span-2">
                {topArticle && <ArticleCard article={topArticle} variant="featured" />}
              </div>
              
              {/* Side Latest */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-display)] border-b-2 border-[var(--color-accent)] pb-2 inline-block">آخر الأخبار</h3>
                <div className="space-y-0">
                  {otherArticles.slice(0, 5).map(article => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categories.map((category, idx) => {
          const catArticles = getArticlesByCategory(category.id, { limit: 4 });
          if (catArticles.length === 0) return null;
          const Icon = sectionIcons[category.slug] || Clock;
          
          return (
            <section key={category.id} className={`py-6 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center text-white">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">{category.name}</h2>
                  </div>
                  <Link href={`/section/${category.slug}`} className="text-sm text-[var(--color-accent)] hover:underline font-bold">
                    المزيد ←
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </>
  );
}
