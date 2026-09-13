'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Save } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  author: string;
  status: string;
  isBreaking: number;
  publishedAt: string;
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${params.id}`)
      .then(res => res.json())
      .then(setArticle);
  }, [params.id]);

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);
    
    const res = await fetch(`/api/articles/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    
    if (res.ok) setSaved(true);
    setSaving(false);
  };

  if (!article) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">تحرير المقال</h1>
            <button onClick={handleSave} disabled={saving} className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50">
              <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>

          {saved && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4">تم حفظ المقال بنجاح!</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المقال</label>
                <input type="text" value={article.title} onChange={e => setArticle({ ...article, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى (HTML)</label>
                <textarea 
                  value={article.content} 
                  onChange={e => setArticle({ ...article, content: e.target.value })} 
                  rows={20} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" 
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold mb-3">إعدادات المقال</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">الحالة</label>
                    <select value={article.status} onChange={e => setArticle({ ...article, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="draft">مسودة</option>
                      <option value="published">منشور</option>
                      <option value="scheduled">مجدول</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">القسم</label>
                    <select value={article.categoryId} onChange={e => setArticle({ ...article, categoryId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="">اختر قسماً</option>
                      <option value="cat-1">أخبار محلية</option>
                      <option value="cat-2">أخبار دولية</option>
                      <option value="cat-3">رياضة</option>
                      <option value="cat-4">المرأة والمجتمع</option>
                      <option value="cat-5">حوادث</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">الكاتب</label>
                    <input type="text" value={article.author} onChange={e => setArticle({ ...article, author: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={article.isBreaking === 1} onChange={e => setArticle({ ...article, isBreaking: e.target.checked ? 1 : 0 })} className="rounded" />
                    <label className="text-sm font-medium">خبر عاجل</label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold mb-3">صورة المقال</h3>
                <input type="url" value={article.featuredImage} onChange={e => setArticle({ ...article, featuredImage: e.target.value })} placeholder="رابط الصورة" className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                {article.featuredImage && <img src={article.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold mb-3">ملخص المقال</h3>
                <textarea value={article.excerpt} onChange={e => setArticle({ ...article, excerpt: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
