'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) setCategories(await res.json());
  };

  const addCategory = async () => {
    if (!newCat.name.trim()) return alert('اسم القسم مطلوب');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      setNewCat({ name: '', slug: '', description: '' });
      setAdding(false);
      fetchCategories();
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">إدارة الأقسام</h1>
            <button onClick={() => setAdding(true)} className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <Plus size={18} /> قسم جديد
            </button>
          </div>

          {adding && (
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">إضافة قسم جديد</h3>
                <button onClick={() => setAdding(false)}><X size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" placeholder="اسم القسم" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                <input type="text" placeholder="الرابط (slug)" value={newCat.slug} onChange={e => setNewCat({ ...newCat, slug: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                <input type="text" placeholder="الوصف" value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
              </div>
              <button onClick={addCategory} className="mt-3 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Save size={16} /> حفظ
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">القسم</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الرابط</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الوصف</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{cat.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{cat.description || '-'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
