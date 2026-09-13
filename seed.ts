import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'news.db');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id TEXT REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category_id TEXT REFERENCES categories(id),
    author TEXT,
    status TEXT DEFAULT 'draft',
    is_breaking INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    scheduled_at TIMESTAMP,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_url TEXT NOT NULL,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    size_bytes INTEGER,
    uploaded_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT,
    is_active INTEGER DEFAULT 1,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

const cats = [
  { id: 'cat-1', name: 'أخبار محلية', slug: 'local-news', description: 'أخبار محلية من مختلف المناطق' },
  { id: 'cat-2', name: 'أخبار دولية', slug: 'international-news', description: 'آخر الأخبار العالمية والدولية' },
  { id: 'cat-3', name: 'رياضة', slug: 'sports', description: 'أخبار رياضة محلية وعالمية' },
  { id: 'cat-4', name: 'المرأة والمجتمع', slug: 'women-society', description: 'أخبار المرأة والمجتمع' },
  { id: 'cat-5', name: 'حوادث', slug: 'accidents', description: 'أخبار حوادث وقضايا' },
];

const now = new Date().toISOString();
const sampleArticles = [
  {
    id: 'art-1',
    title: 'افتتاح مشروع تطوير المنطقة الوسطى بمدينة نصر',
    slug: 'opening-middle-zone-development',
    excerpt: 'تم اليوم افتتاح مشروع تطوير المنطقة الوسطى بمدينة نصر بحضور محافظ القاهرة وعدد من المسؤولين.',
    content: '<h2>افتتاح مشروع تطوير المنطقة الوسطى</h2><p>تم اليوم افتتاح مشروع تطوير المنطقة الوسطى بمدينة نصر بحضور محافظ القاهرة وعدد من المسؤولين. يهدف المشروع إلى تحسين البنية التحتية للمنطقة وتطوير المرافق العامة.</p><p>وقال المحافظ في تصريحصه أن المشروع يأتي في إطار خطة الدولة لتطوير المناطق الحضرية وتحسين جودة الحياة للمواطنين.</p><blockquote>هذا المشروع نقلة نوعية للمنطقة الوسطى</blockquote><p>وأضاف أن التكلفة الإجمالية للمشروع بلغت 500 مليون جنيه، ومن المتوقع أن يخلق أكثر من 2000 فرصة عمل جديدة.</p>',
    featuredImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=500&fit=crop',
    categoryId: 'cat-1',
    author: 'أحمد محمد',
    status: 'published',
    isBreaking: true,
    publishedAt: now,
    metaTitle: 'افتتاح مشروع تطوير المنطقة الوسطى',
    metaDescription: 'محافظ القاهرة يفتتح مشروع تطوير المنطقة الوسطى بتكلفة 500 مليون جنيه',
  },
  {
    id: 'art-2',
    title: 'قمة عالمية لمناخ الأرض تنطلق في دبي بمشاركة 150 دولة',
    slug: 'global-climate-summit-dubai',
    excerpt: 'انطلقت اليوم في إمارة دبي القمة العالمية لمناخ الأرض بمشاركة ممثلين عن 150 دولة.',
    content: '<h2>قمة المناخ العالمية</h2><p>انطلقت اليوم في إمارة دبي القمة العالمية لمناخ الأرض بمشاركة ممثلين عن 150 دولة. تناقش القمة سبل مواجهة تحديات التغير المناخي والتحول إلى الطاقة النظيفة.</p><p>وقال رئيس المؤتمر أن القمة تهدف لوضع خارطة طريق واضحة للوصول إلى الحياد الكربوني بحلول عام 2050.</p><h3>أهم المخرجات المتوقعة</h3><ul><li>خطة عمل لمدة 5 سنوات</li><li>صندوق تمويل بقيمة 100 مليار دولار</li><li>التزام 100 دولة بخفض الانبعاثات</li></ul>',
    featuredImage: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=500&fit=crop',
    categoryId: 'cat-2',
    author: 'فاطمة علي',
    status: 'published',
    isBreaking: false,
    publishedAt: now,
    metaTitle: 'قمة مناخ الأرض في دبي',
    metaDescription: '150 دولة تشارك في قمة مناخ الأرض العالمية',
  },
  {
    id: 'art-3',
    title: 'الأهلي يحقق فوزاً كبيراً في الدوري المصري',
    slug: 'alahly-big-win-egyptian-league',
    excerpt: 'حقق النادي الأهلي فوزاً كبيراً على منافسه بثلاثية نظيفة في إطار منافسات الدوري المصري الممتاز.',
    content: '<h2>الأهلي يتوج بدورى المصري</h2><p>حقق النادي الأهلي فوزاً كبيراً على منافسه بثلاثية نظيفة في إطار منافسات الدوري المصري الممتاز لكرة القدم.</p><p>سجل أهداف الأهلي محمد الشناوي في الدقيقة 23، وحسام حسن في الدقيقة 56، وعمرو وردة في الدقيقة 78.</p><blockquote>أداء رائع من لاعبي الأهلي</blockquote><p>بهذا الفوز يرتقي الأهلي إلى صدارة ترتيب الدوري المصري الممتاز.</p>',
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
    categoryId: 'cat-3',
    author: 'خالد إبراهيم',
    status: 'published',
    isBreaking: false,
    publishedAt: now,
    metaTitle: 'الأهلي يفوز بثلاثية نظيفة',
    metaDescription: 'الأهلي يتفوق على منافسه في الدوري المصري',
  },
  {
    id: 'art-4',
    title: 'حملة توعية جديدة لصحة المرأة المصرية',
    slug: 'women-health-awareness-campaign',
    excerpt: 'أطلقت وزارة الصحة اليوم حملة توعية شاملة لصحة المرأة المصرية تحت عنوان "صحتك أولاً".',
    content: '<h2>حملة صحتك أولاً</h2><p>أطلقت وزارة الصحة اليوم حملة توعية شاملة لصحة المرأة المصرية تحت عنوان "صحتك أولاً" وتشمل الحملة فحوصات مجانية وندوات توعوية في جميع المحافظات.</p><p>وقالت وزيرة الصحة أن الحملة تهتم بصحة المرأة النفسية والجسدية والإنجابية.</p><h3>خدمات الحملة</h3><ul><li>فحص مجاني للسرطان الثدي</li><li>ندوات توعوية</li><li>استشارات طبية مجانية</li></ul>',
    featuredImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
    categoryId: 'cat-4',
    author: 'سارة محمود',
    status: 'published',
    isBreaking: false,
    publishedAt: now,
    metaTitle: 'حملة توعية لصحة المرأة المصرية',
    metaDescription: 'وزارة الصحة تطلق حملة "صحتك أولاً"',
  },
  {
    id: 'art-5',
    title: 'حادث مروري كبير على الطريق الدائري',
    slug: 'major-traffic-accident-circular-road',
    excerpt: 'وقع حادث مروري كبير صباح اليوم على الطريق الدائري مما أدى إلى ازدحام مروري شديد.',
    content: '<h2>حادث مروري بالطريق الدائري</h2><p>وقع حادث مروري كبير صباح اليوم على الطريق الدائري مما أدى إلى ازدحام مروري شديد. الحادث نتج عن تصادم ثلاثة سيارات.</p><p>تم نقل المصابين إلى المستشفى وتقوم الجهات المختصة بالتحقيق في أسباب الحادث.</p><blockquote>نرجو من المواطنين استخدام الطرق البديلة</blockquote>',
    featuredImage: 'https://images.unsplash.com/photo-1449965408869-ebd3fee7710d?w=800&h=500&fit=crop',
    categoryId: 'cat-5',
    author: 'محمد سعيد',
    status: 'published',
    isBreaking: true,
    publishedAt: now,
    metaTitle: 'حادث مروري على الطريق الدائري',
    metaDescription: 'حادث مروري كبير يسبب ازدحام بالطريق الدائري',
  },
];

for (const cat of cats) {
  sqlite.prepare('INSERT OR IGNORE INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)').run(cat.id, cat.name, cat.slug, cat.description);
}

for (const art of sampleArticles) {
  sqlite.prepare(`INSERT OR IGNORE INTO articles (id, title, slug, excerpt, content, featured_image, category_id, author, status, is_breaking, published_at, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    art.id, art.title, art.slug, art.excerpt, art.content, art.featuredImage, art.categoryId, art.author, art.status, art.isBreaking ? 1 : 0, art.publishedAt, art.metaTitle, art.metaDescription
  );
}

const adminPass = bcrypt.hashSync('admin123', 12);
sqlite.prepare('INSERT OR IGNORE INTO admin_users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)').run('admin-1', 'admin', adminPass, 'المدير العام');

console.log('✅ Database seeded successfully!');
console.log('Categories:', cats.length);
console.log('Articles:', sampleArticles.length);
console.log('Admin user: admin / admin123');
sqlite.close();
