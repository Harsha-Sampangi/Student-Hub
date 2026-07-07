'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Copy, Filter, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import type { Opportunity, OpportunityCategory } from '@/types';

import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';

const CATEGORIES: { label: string; value: OpportunityCategory }[] = [
  { label: 'Hackathon', value: 'Hackathon' },
  { label: 'Internship', value: 'Internship' },
  { label: 'Workshop', value: 'Workshop' },
  { label: 'Open Source', value: 'Open Source' },
  { label: 'Contest', value: 'Coding Contest' },
  { label: 'Scholarship', value: 'Scholarship' },
  { label: 'Fellowship', value: 'Fellowship' },
  { label: 'Campus Ambassador', value: 'Campus Ambassador' },
  { label: 'Job', value: 'Job' },
];

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Opportunity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form State
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '',
    platform: '',
    category: 'Hackathon',
    location: '',
    mode: 'online',
    deadline: '',
    applyLink: '',
    description: '',
    isActive: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCollection<Opportunity>('opportunities');
      setOpportunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: Opportunity) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        deadline: item.deadline ? item.deadline.split('T')[0] : ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        platform: '',
        category: 'Hackathon',
        location: '',
        mode: 'online',
        deadline: '',
        applyLink: '',
        description: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: Opportunity) => {
    setEditingItem(null);
    setFormData({
      ...item,
      title: `${item.title} (Copy)`,
      isActive: false,
      deadline: item.deadline ? item.deadline.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await deleteDocument('opportunities', id);
      setOpportunities(prev => prev.filter(o => o.id !== id));
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
        await updateDocument('opportunities', editingItem.id, formData);
      } else {
        await addDocument('opportunities', formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (opp: Opportunity) => {
    await updateDocument('opportunities', opp.id!, { isActive: !opp.isActive });
    await loadData();
  };

  // Filtering & Sorting
  let filteredData = opportunities.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || o.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && o.isActive) || 
      (statusFilter === 'draft' && !o.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (sortBy === 'newest') {
    filteredData.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  } else if (sortBy === 'oldest') {
    filteredData.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
  } else if (sortBy === 'a-z') {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  }

  const columns: Column<Opportunity>[] = [
    {
      header: 'Opportunity',
      accessor: (item) => (
        <div>
          <p className="font-semibold text-admin-text-primary">{item.title}</p>
          <p className="text-xs text-admin-text-secondary mt-0.5">{item.platform} • {item.location}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item) => <AdminBadge category={item.category} />,
    },
    {
      header: 'Status',
      accessor: (item) => <AdminStatusBadge status={item.isActive ? 'Active' : 'Draft'} />,
    },
    {
      header: 'Deadline',
      accessor: (item) => (
        <span className="text-admin-text-tertiary text-[13px]">
          {item.deadline ? new Date(item.deadline).toLocaleDateString('en-IN', {
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
            onClick={(e) => { e.stopPropagation(); handleToggleActive(item); }}
            className={`p-1.5 rounded-lg transition-colors ${item.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-admin-text-tertiary hover:bg-admin-surface-container'}`}
            title={item.isActive ? "Deactivate" : "Activate"}
          >
            {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
      {/* Redesigned Toolbar - One Row (Issue 11) */}
      <div className="flex flex-col lg:flex-row gap-3 items-end lg:items-center justify-between bg-admin-surface p-3 rounded-admin-lg border border-admin-border/50 shadow-admin-sm shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-text-tertiary" />
            <input
              type="text"
              placeholder="Search opportunities..."
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
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-admin-border/50 bg-admin-surface-container text-sm text-admin-text-primary appearance-none focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
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
          Add Opportunity
        </AdminButton>
      </div>

      {/* Main Table Area (Issue 10: Compressed whitespace) */}
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
                title="No opportunities found"
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
        title={editingItem ? 'Edit Opportunity' : 'Create Opportunity'}
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
              label="Hosting Organization"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminSelect
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as OpportunityCategory })}
              options={CATEGORIES}
            />
            <AdminInput
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <AdminInput
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminSelect
              label="Mode"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
              options={[
                { label: 'Online', value: 'online' },
                { label: 'Offline', value: 'offline' },
                { label: 'Hybrid', value: 'hybrid' },
              ]}
            />
            <AdminInput
              label="Apply Link"
              type="url"
              value={formData.applyLink}
              onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
              required
              placeholder="https://"
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
          
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-admin-border bg-admin-surface-container text-admin-brand focus:ring-admin-brand focus:ring-offset-admin-surface"
            />
            <span className="text-sm font-medium text-admin-text-primary select-none">
              Make this opportunity active immediately
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-admin-border/50">
            <AdminButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isSubmitting}>
              {editingItem ? 'Save Changes' : 'Create Opportunity'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
