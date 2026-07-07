'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Copy, Filter, ArrowUpDown } from 'lucide-react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import type { Resource, ResourceCategory } from '@/types';

import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';

const CATEGORIES: ResourceCategory[] = [
  'Roadmaps',
  'PDFs',
  'Learning',
  'GitHub Repos',
  'Career Prep',
  'Tools'
];

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Resource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form State
  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '',
    category: 'Learning',
    description: '',
    link: '',
    type: 'link',
    icon: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCollection<Resource>('resources');
      setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: Resource) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: 'Learning',
        description: '',
        link: '',
        type: 'link',
        icon: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: Resource) => {
    setEditingItem(null);
    setFormData({
      ...item,
      title: `${item.title} (Copy)`,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteDocument('resources', id);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await updateDocument('resources', editingItem.id, formData);
      } else {
        await addDocument('resources', formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save resource.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering & Sorting
  let filteredData = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'newest') {
    filteredData.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else if (sortBy === 'oldest') {
    filteredData.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
  } else if (sortBy === 'a-z') {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  }

  const columns: Column<Resource>[] = [
    {
      header: 'Resource',
      accessor: (item) => (
        <div>
          <p className="font-semibold text-admin-text-primary">{item.title}</p>
          <p className="text-xs text-admin-text-secondary mt-0.5"><span className="uppercase tracking-wider">{item.type}</span></p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item) => <AdminBadge category={item.category} />,
    },
    {
      header: 'Date Added',
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
              placeholder="Search resources..."
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
          Add Resource
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
                title="No resources found"
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
        title={editingItem ? 'Edit Resource' : 'Create Resource'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <AdminInput
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminSelect
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              options={CATEGORIES.map(c => ({ label: c, value: c }))}
            />
            <AdminSelect
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { label: 'PDF', value: 'pdf' },
                { label: 'Link', value: 'link' },
                { label: 'GitHub Repo', value: 'repo' },
                { label: 'Video', value: 'video' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Resource Link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://"
              required
            />
            <AdminInput
              label="Icon Name (Optional)"
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g. file-text, link, github"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-semibold uppercase tracking-wider text-admin-text-secondary">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-admin-border/50 bg-admin-surface px-4 py-2 text-sm text-admin-text-primary transition-colors focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand min-h-[120px]"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-admin-border/50">
            <AdminButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isSubmitting}>
              {editingItem ? 'Save Changes' : 'Create Resource'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
