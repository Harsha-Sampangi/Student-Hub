'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationTriangle,
  HiOutlineCalendarDays,
  HiOutlineUser,
  HiOutlineTag,
} from 'react-icons/hi2';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import type { BlogPost } from '@/types';

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [readingTime, setReadingTime] = useState<number>(5);
  const [isPublished, setIsPublished] = useState(true);

  const loadBlogs = async () => {
    try {
      const data = await fetchCollection<BlogPost>('blogs');
      setBlogs(data);
    } catch (e) {
      console.error('Failed to load blogs:', e);
    }
  };

  // Load from database
  useEffect(() => {
    loadBlogs();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBlog) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 50)
      );
    }
  };

  // Filter logic
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Published' && b.isPublished) || 
      (statusFilter === 'Draft' && !b.isPublished);
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setTagsInput('');
    setCategory('Technology');
    setAuthor('Student Hub Admin');
    setAuthorAvatar('');
    setThumbnailUrl('');
    setReadingTime(5);
    setIsPublished(true);
    setIsFormOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setContent(blog.content);
    setExcerpt(blog.excerpt);
    setTagsInput(blog.tags.join(', '));
    setCategory(blog.category);
    setAuthor(blog.author);
    setAuthorAvatar(blog.authorAvatar || '');
    setThumbnailUrl(blog.thumbnailUrl || '');
    setReadingTime(blog.readingTime);
    setIsPublished(blog.isPublished);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !content.trim() || !excerpt.trim() || !category.trim() || !author.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      content,
      excerpt,
      tags: tagsArray,
      category,
      author,
      authorAvatar: authorAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${author}`,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      readingTime: Number(readingTime),
      isPublished,
    };

    if (editingBlog) {
      // Edit
      await updateDocument('blogs', editingBlog.id, payload);
    } else {
      // Add
      await addDocument('blogs', payload);
    }
    await loadBlogs();
    setIsFormOpen(false);
  };

  const handleTogglePublished = async (blog: BlogPost) => {
    await updateDocument('blogs', blog.id, { isPublished: !blog.isPublished });
    await loadBlogs();
  };

  const openDeleteModal = (blog: BlogPost) => {
    setDeletingBlog(blog);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingBlog) {
      await deleteDocument('blogs', deletingBlog.id);
      await loadBlogs();
      setIsDeleteOpen(false);
      setDeletingBlog(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display sm:text-3xl">
            Blog Posts
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Write, edit, and publish blogs, tutorials, and success stories.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue hover:bg-brand-blue-dark px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Write Blog
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search blogs by title/author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-container py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        {filteredBlogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-container/50 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-secondary">
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-surface-container/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text-primary">{blog.title}</div>
                      <div className="text-xs text-text-tertiary">/{blog.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineUser className="h-4 w-4 text-text-tertiary" />
                        <span>{blog.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCalendarDays className="h-4 w-4 text-text-tertiary" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(blog)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          blog.isPublished
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {blog.isPublished ? (
                          <>
                            <HiOutlineEye className="h-3.5 w-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <HiOutlineEyeSlash className="h-3.5 w-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-container hover:text-text-primary transition-colors"
                        title="Edit Blog"
                      >
                        <HiOutlinePencilSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete Blog"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-text-secondary font-medium">No articles match the criteria.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-display text-xl font-bold text-text-primary">
                  {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg p-1 text-text-tertiary hover:bg-surface-container"
                >
                  <HiOutlineXMark className="h-6 w-6" />
                </button>
              </div>

              {/* Form Scroll Container */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Navigating your first Hackathon"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Slug (URL path) *
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. navigating-first-hackathon"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Guide, Tech, Career"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Harsha Sampangi"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Reading Time (Minutes) *
                    </label>
                    <input
                      type="number"
                      value={readingTime}
                      onChange={(e) => setReadingTime(Number(e.target.value))}
                      min={1}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Thumbnail Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Tags (Comma separated)
                    </label>
                    <div className="relative">
                      <HiOutlineTag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                      <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. Hackathons, Coding, Tips"
                        className="w-full rounded-xl border border-border bg-surface-container pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                    Excerpt (Short summary) *
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Provide a 1-2 sentence description that appears on the blog index page..."
                    className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                    Content (Markdown or Rich Text) *
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article here..."
                    className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none font-mono"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="blog-status"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-surface-container text-brand-blue focus:ring-brand-blue"
                  />
                  <label htmlFor="blog-status" className="text-sm font-medium text-text-secondary select-none">
                    Publish this article immediately
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-blue hover:bg-brand-blue-dark px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-brand-blue/20"
                  >
                    {editingBlog ? 'Save Changes' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <HiOutlineExclamationTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    Delete Post
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Are you sure you want to delete <span className="font-semibold text-text-primary">&ldquo;{deletingBlog?.title}&rdquo;</span>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/15"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
