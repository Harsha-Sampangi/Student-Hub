'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Copy, Filter, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import type { BlogPost } from '@/types';

import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';

const CATEGORIES = ['Technical', 'Career', 'Interview Prep', 'Open Source', 'Community'];

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    author: '',
    authorAvatar: '',
    category: 'Technical',
    content: '',
    excerpt: '',
    thumbnailUrl: '',
    readingTime: 5,
    isPublished: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCollection<BlogPost>('blogs');
      setBlogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: BlogPost) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        slug: '',
        author: '',
        authorAvatar: '',
        category: 'Technical',
        content: '',
        excerpt: '',
        thumbnailUrl: '',
        readingTime: 5,
        isPublished: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: BlogPost) => {
    setEditingItem(null);
    setFormData({
      ...item,
      title: `${item.title} (Copy)`,
      slug: `${item.slug}-copy`,
      isPublished: false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteDocument('blogs', id);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
      };
      
      if (editingItem?.id) {
        await updateDocument('blogs', editingItem.id, payload);
      } else {
        await addDocument('blogs', payload);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublished = async (blog: BlogPost) => {
    await updateDocument('blogs', blog.id!, { isPublished: !blog.isPublished });
    await loadData();
  };

  // Filtering & Sorting
  let filteredData = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && b.isPublished) || 
      (statusFilter === 'draft' && !b.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (sortBy === 'newest') {
    filteredData.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else if (sortBy === 'oldest') {
    filteredData.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
  } else if (sortBy === 'a-z') {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  }

  const columns: Column<BlogPost>[] = [
    {
      header: 'Title & Author',
      accessor: (item) => (
        <div>
          <p className="font-semibold text-admin-text-primary truncate max-w-xs" title={item.title}>{item.title}</p>
          <p className="text-xs text-admin-text-secondary mt-0.5">{item.author}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item) => <AdminBadge category={item.category} />,
    },
    {
      header: 'Status',
      accessor: (item) => <AdminStatusBadge status={item.isPublished ? 'Published' : 'Draft'} />,
    },
    {
      header: 'Date',
      accessor: (item) => (
        <span className="text-admin-text-tertiary text-[13px]">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          }) : 'N/A'}
        </span>
      ),
    },
    {
      header: '',
      className: 'text-right',
      accessor: (item) => (
        <div className="flex justify-end gap-3 items-center">
          <button
            onClick={(e) => { e.stopPropagation(); handleTogglePublished(item); }}
            className={`p-1.5 rounded-lg transition-colors ${item.isPublished ? 'text-emerald-600 hover:bg-emerald-50' : 'text-admin-text-tertiary hover:bg-admin-surface-container'}`}
            title={item.isPublished ? "Unpublish" : "Publish"}
          >
            {item.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <AdminActionMenu 
            items={[
              { label: 'Edit', icon: Edit, onClick: () => handleOpenModal(item) },
              { label: 'Duplicate', icon: Copy, onClick: () => handleDuplicate(item) },
              { label: 'Delete', icon: Trash2, onClick: () => handleDelete(item.id!), variant: 'danger' },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-end lg:items-center justify-between bg-admin-surface p-3 rounded-admin-lg border border-admin-border/50 shadow-admin-sm shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-text-tertiary" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-admin-border/50 bg-admin-surface-container py-2 pl-9 pr-4 text-sm text-admin-text-primary placeholder:text-admin-text-tertiary focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-text-tertiary pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-lg border border-admin-border/50 bg-admin-surface-container text-sm text-admin-text-primary appearance-none focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all min-w-[140px]"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-admin-border/50 bg-admin-surface-container text-sm text-admin-text-primary appearance-none focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-text-tertiary pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-lg border border-admin-border/50 bg-admin-surface-container text-sm text-admin-text-primary appearance-none focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all min-w-[130px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>
          </div>
        </div>
        <AdminButton
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => handleOpenModal()}
          className="shrink-0 w-full sm:w-auto"
        >
          Add Post
        </AdminButton>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-admin-brand/20 border-t-admin-brand" />
          </div>
        ) : (
          <AdminTable
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id!}
            onRowClick={(item) => handleOpenModal(item)}
            emptyState={
              <AdminEmptyState
                icon={<Search className="h-8 w-8 text-admin-text-tertiary" />}
                title="No blog posts found"
                description="Try adjusting your search or filters."
              />
            }
          />
        )}
      </div>

      {/* Editor Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Blog Post' : 'Create Blog Post'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <AdminInput
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
            <AdminInput
              label="Author Avatar URL"
              value={formData.authorAvatar}
              onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminSelect
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORIES.map(c => ({ label: c, value: c }))}
            />
            <AdminInput
              label="Read Time (mins)"
              type="number"
              value={formData.readingTime?.toString()}
              onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <AdminInput
            label="Thumbnail URL"
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            placeholder="https://"
            required
          />

          <div className="space-y-1">
            <label className="text-[13px] font-semibold uppercase tracking-wider text-admin-text-secondary">
              Excerpt
            </label>
            <textarea
              className="w-full rounded-lg border border-admin-border/50 bg-admin-surface px-4 py-2 text-sm text-admin-text-primary transition-colors focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand min-h-[60px]"
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-semibold uppercase tracking-wider text-admin-text-secondary">
              Content (Markdown supported)
            </label>
            <textarea
              className="w-full rounded-lg border border-admin-border/50 bg-admin-surface px-4 py-2 text-sm text-admin-text-primary transition-colors focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand min-h-[240px] font-mono"
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 rounded border-admin-border bg-admin-surface-container text-admin-brand focus:ring-admin-brand focus:ring-offset-admin-surface"
            />
            <span className="text-sm font-medium text-admin-text-primary select-none">
              Publish this post immediately
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-admin-border/50">
            <AdminButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isSubmitting}>
              {editingItem ? 'Save Changes' : 'Create Post'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
