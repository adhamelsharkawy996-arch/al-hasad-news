'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const navItems = [
  { label: 'الرئيسية', href: '/' },
  { label: 'أخبار محلية', href: '/section/local-news' },
  { label: 'أخبار دولية', href: '/section/international-news' },
  { label: 'رياضة', href: '/section/sports' },
  { label: 'المرأة والمجتمع', href: '/section/women-society' },
  { label: 'حوادث', href: '/section/accidents' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-[var(--color-primary)] text-white sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="bg-[var(--color-secondary)] py-2 text-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <Link href="/admin" className="hover:text-[var(--color-accent)] transition-colors">لوحة التحكم</Link>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[var(--color-accent)] rounded-lg flex items-center justify-center text-[var(--color-primary)] font-bold text-2xl">
            ح
          </div>
          <div>
            <h1 className="text-xl font-bold font-[var(--font-display)]">وكالة أنباء الحسد</h1>
            <p className="text-xs text-white/60">Al Hasad News Agency</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm hover:text-[var(--color-accent)] transition-colors">
              {item.label}
            </Link>
          ))}
          <Link href="/search" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Search size={18} />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-[var(--color-secondary)] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="py-2 border-b border-white/5 hover:text-[var(--color-accent)]">
                {item.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setMobileOpen(false)} className="py-2 flex items-center gap-2 hover:text-[var(--color-accent)]">
              <Search size={16} /> بحث
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
