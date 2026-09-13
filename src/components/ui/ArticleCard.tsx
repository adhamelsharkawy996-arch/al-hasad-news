import Link from 'next/link';
import { formatRelative } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    author?: string | null;
    publishedAt?: string | null;
    isBreaking?: boolean;
    category?: { name: string; slug: string } | null;
  };
  variant?: 'default' | 'featured' | 'compact';
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/article/${article.slug}`} className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
        <div className="aspect-[16/9] bg-gray-200 relative">
          {article.featuredImage ? (
            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">لا صورة</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-6 text-white">
            {article.isBreaking && (
              <span className="bg-[var(--color-danger)] text-xs px-2 py-1 rounded-full mb-2 inline-block">عاجل</span>
            )}
            {article.category && (
              <span className="bg-[var(--color-accent)] text-[var(--color-primary)] text-xs px-2 py-1 rounded-full mb-2 inline-block mr-2">{article.category.name}</span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] line-clamp-2 mb-2">{article.title}</h2>
            {article.excerpt && <p className="text-white/80 line-clamp-2 mb-3">{article.excerpt}</p>}
            <div className="flex items-center gap-4 text-xs text-white/60">
              {article.author && <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>}
              {article.publishedAt && <span className="flex items-center gap-1"><Calendar size={12} /> {formatRelative(article.publishedAt)}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
        {article.featuredImage && (
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors">{article.title}</h4>
          {article.publishedAt && <span className="text-xs text-gray-500 mt-1 block">{formatRelative(article.publishedAt)}</span>}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 bg-white">
      <div className="aspect-[16/9] bg-gray-200 relative overflow-hidden">
        {article.featuredImage ? (
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">لا صورة</div>
        )}
        {article.isBreaking && <span className="absolute top-3 right-3 bg-[var(--color-danger)] text-white text-xs px-2 py-1 rounded-full">عاجل</span>}
      </div>
      <div className="p-4">
        {article.category && (
          <span className="text-xs text-[var(--color-accent)] font-bold block mb-1">{article.category.name}</span>
        )}
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors font-[family-name:var(--font-display)]">{article.title}</h3>
        {article.excerpt && <p className="text-sm text-gray-600 line-clamp-2 mt-2">{article.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
          {article.author && <span className="flex items-center gap-1"><User size={11} /> {article.author}</span>}
          {article.publishedAt && <span className="flex items-center gap-1"><Calendar size={11} /> {formatRelative(article.publishedAt)}</span>}
        </div>
      </div>
    </Link>
  );
}
