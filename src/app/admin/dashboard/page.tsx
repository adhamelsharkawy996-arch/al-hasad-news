'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Plus, Edit, Trash2, FileText, FolderOpen, Image as ImageIcon, BarChart3, Eye } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  isBreaking: number;
  author: string;
  publishedAt: string | null;
  category_name: string | null;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({ articles: 0, categories: 0, published: 0, breaking: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/admin/data');
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles || []);
      setStats(data.stats || { articles: 0, categories: 0, published: 0, breaking: 0 });
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">لوحة التحكم</h1>
            <div className="flex gap-3">
              <Link href="/admin/articles/new" className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-accent)]/80">
                <Plus size={18} /> مقال جديد
              </Link>
              <Link href="/admin/categories" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-secondary)]">
                <FolderOpen size={18} /> الأقسام
              </Link>
              <Link href="/admin/media" className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-primary)]">
                <ImageIcon size={18} /> الوسائط
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                <div><p className="text-sm text-gray-500">إجمالي المقالات</p><p className="text-2xl font-bold">{stats.articles}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><BarChart3 size={20} /></div>
                <div><p className="text-sm text-gray-500">منشور</p><p className="text-2xl font-bold">{stats.published}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center"><Eye size={20} /></div>
                <div><p className="text-sm text-gray-500">عاجل</p><p className="text-2xl font-bold">{stats.breaking}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center"><FolderOpen size={20} /></div>
                <div><p className="text-sm text-gray-500">الأقسام</p><p className="text-2xl font-bold">{stats.categories}</p></div>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">إدارة المقالات</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-right">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">المقال</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">القسم</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">الحالة</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">تاريخ النشر</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          {article.isBreaking === 1 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">عاجل</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{article.category_name || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${article.status === 'published' ? 'bg-green-100 text-green-600' : article.status === 'draft' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                          {article.status === 'published' ? 'منشور' : article.status === 'draft' ? 'مسودة' : 'مجدول'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ar-EG') : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></Link>
                          <button onClick={() => deleteArticle(article.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {articles.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">لا توجد مقالات</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
