import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 text-[var(--color-accent)]">وكالة أنباء الحسد</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            وكالة أنباء مستقلة تقدم أخباراً دقيقة وموثوقة في مختلف المجالات
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">الأقسام</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/section/local-news" className="hover:text-[var(--color-accent)]">أخبار محلية</Link></li>
            <li><Link href="/section/international-news" className="hover:text-[var(--color-accent)]">أخبار دولية</Link></li>
            <li><Link href="/section/sports" className="hover:text-[var(--color-accent)]">رياضة</Link></li>
            <li><Link href="/section/women-society" className="hover:text-[var(--color-accent)]">المرأة والمجتمع</Link></li>
            <li><Link href="/section/accidents" className="hover:text-[var(--color-accent)]">حوادث</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">روابط</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/" className="hover:text-[var(--color-accent)]">الرئيسية</Link></li>
            <li><Link href="/search" className="hover:text-[var(--color-accent)]">بحث</Link></li>
            <li><Link href="/admin" className="hover:text-[var(--color-accent)]">لوحة التحكم</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">تواصل معنا</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>البريد: info@alhasad.news</li>
            <li>الهاتف: +20 155 123 4567</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-white/50">
        <p>© {new Date().getFullYear()} وكالة أنباء الحسد. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
