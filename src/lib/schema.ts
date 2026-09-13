import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parentId: text('parent_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  categoryId: text('category_id'),
  author: text('author'),
  status: text('status').default('draft'),
  isBreaking: integer('is_breaking', { mode: 'boolean' }).default(false),
  publishedAt: text('published_at'),
  scheduledAt: text('scheduled_at'),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  originalUrl: text('original_url').notNull(),
  altText: text('alt_text'),
  width: integer('width'),
  height: integer('height'),
  sizeBytes: integer('size_bytes'),
  uploadedBy: text('uploaded_by'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  lastLogin: text('last_login'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
