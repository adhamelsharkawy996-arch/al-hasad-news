'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ArticleCard from '@/components/ui/ArticleCard';
import { Search as SearchIcon } from 'lucide-react';
import type { Article } from '@/lib/data';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(!!searchParams.get('q'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data);
      setSearched(true);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

  return (
    <>
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-secondary)] text-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold font-[family-name:var(--font-display)] mb-6">البحث في المقالات</h1>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ابحث هنا..."
                className="w-full px-6 py-4 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/50"
                aria-label="كلمة البحث"
              />
              <button type="submit" className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-white p-2 rounded-lg hover:bg-[var(--color-accent)]/80 transition-colors" aria-label="بحث">
                <SearchIcon size={20} />
              </button>
            </form>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4">
            {searched && !loading && (
              <p className="text-gray-600 mb-6">
                {results.length > 0 ? `تم العثور على ${results.length} نتيجة لـ "${query}"` : `لم يتم العثور على نتائج لـ "${query}"`}
              </p>
            )}

            {loading && (
              <p className="text-center text-gray-500 py-8">جاري البحث...</p>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {!searched && !loading && (
              <div className="text-center py-16 text-gray-500">
                <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>اكتب كلمة للبحث في المقالات</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
