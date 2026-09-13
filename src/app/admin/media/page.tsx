'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { Upload, Trash2, Copy, Check } from 'lucide-react';

export default function MediaPage() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    const res = await fetch('/api/images');
    if (res.ok) setImages(await res.json());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });
    }
    setUploading(false);
    fetchImages();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteImage = async (id: string) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await fetch(`/api/images/${id}`, { method: 'DELETE' });
    fetchImages();
  };

  return (
    <>
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">مكتبة الوسائط</h1>
            <label className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer hover:bg-[var(--color-accent)]/80">
              <Upload size={18} /> {uploading ? 'جاري الرفع...' : 'رفع صورة'}
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(img => (
              <div key={img.id} className="bg-white rounded-xl overflow-hidden shadow-sm border group relative">
                <div className="aspect-square bg-gray-100">
                  <img src={img.original_url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 truncate">{img.filename}</p>
                  <div className="flex gap-1 mt-1">
                    <button onClick={() => copyUrl(img.original_url)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      {copied === img.original_url ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                    <button onClick={() => deleteImage(img.id)} className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>لا توجد صور بعد</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
