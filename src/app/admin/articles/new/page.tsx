'use client';

import { useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('published');
  const [isBreaking, setIsBreaking] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return alert('عنوان المقال مطلوب');
    
    setSaving(true);
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        featuredImage,
        categoryId,
        author,
        status,
        isBreaking,
        publishedAt: new Date().toISOString(),
      }),
    });
    
    if (res.ok) router.push('/admin/dashboard');
    setSaving(false);
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">مقال جديد</h1>
            <button onClick={handleSave} disabled={saving} className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50">
              <Save size={18} /> {saving ? 'جاري الحفظ...' : 'نشر المقال'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المقال</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-xl font-bold focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" />
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى (HTML)</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={20} className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent" dir="rtl" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold mb-3">إعدادات</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">الحالة</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="draft">مسودة</option>
                      <option value="published">منشور</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">القسم</label>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="cat-1">أخبار محلية</option>
                      <option value="cat-2">أخبار دولية</option>
                      <option value="cat-3">رياضة</option>
                      <option value="cat-4">المرأة والمجتمع</option>
                      <option value="cat-5">حوادث</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">الكاتب</label>
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={isBreaking} onChange={e => setIsBreaking(e.target.checked)} className="rounded" />
                    <label className="text-sm font-medium">خبر عاجل</label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold mb-3">صورة المقال</h3>
                <input type="url" value={featuredImage} onChange={e => setFeaturedImage(e.target.value)} placeholder="رابط الصورة" className="w-full px-3 py-2 border rounded-lg text-sm mb-2" />
                {featuredImage && <img src={featuredImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold mb-3">ملخص المقال</h3>
                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
