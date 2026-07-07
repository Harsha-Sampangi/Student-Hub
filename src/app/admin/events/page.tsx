'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Copy, Filter, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import type { Event as HubEvent } from '@/types';

import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminButton } from '@/components/admin/AdminButton';
import { AdminModal } from '@/components/admin/AdminModal';
import { AdminInput } from '@/components/admin/AdminInput';
import { AdminSelect } from '@/components/admin/AdminSelect';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<HubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HubEvent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form State
  const [formData, setFormData] = useState<Partial<HubEvent>>({
    title: '',
    location: '',
    date: '',
    description: '',
    registerLink: '',
    posterUrl: '',
    mode: 'online',
    isActive: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCollection<HubEvent>('events');
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (item?: HubEvent) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        date: item.date ? item.date.split('T')[0] : ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        location: '',
        date: '',
        description: '',
        registerLink: '',
        posterUrl: '',
        mode: 'online',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: HubEvent) => {
    setEditingItem(null);
    setFormData({
      ...item,
      title: `${item.title} (Copy)`,
      isActive: false,
      date: item.date ? item.date.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDocument('events', id);
      setEvents(prev => prev.filter(e => e.id !== id));
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
        await updateDocument('events', editingItem.id, formData);
      } else {
        await addDocument('events', formData);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUpcoming = async (evt: HubEvent) => {
    await updateDocument('events', evt.id!, { isActive: !evt.isActive });
    await loadData();
  };

  // Filtering & Sorting
  let filteredData = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'upcoming' && e.isActive) || 
      (statusFilter === 'past' && !e.isActive);
    return matchesSearch && matchesStatus;
  });

  if (sortBy === 'newest') {
    filteredData.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
  } else if (sortBy === 'oldest') {
    filteredData.sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
  } else if (sortBy === 'a-z') {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  }

  const columns: Column<HubEvent>[] = [
    {
      header: 'Event Name',
      accessor: (item) => (
        <div>
          <p className="font-semibold text-admin-text-primary">{item.title}</p>
          <p className="text-xs text-admin-text-secondary mt-0.5">{item.location} • <span className="capitalize">{item.mode}</span></p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (item) => <AdminStatusBadge status={item.isActive ? 'Active' : 'Inactive'} />,
    },
    {
      header: 'Date',
      accessor: (item) => (
        <span className="text-admin-text-tertiary text-[13px]">
          {item.date ? new Date(item.date).toLocaleDateString('en-IN', {
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
            onClick={(e) => { e.stopPropagation(); handleToggleUpcoming(item); }}
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
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-end lg:items-center justify-between bg-admin-surface p-3 rounded-admin-lg border border-admin-border/50 shadow-admin-sm shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-admin-text-tertiary" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-admin-border/50 bg-admin-surface-container py-2 pl-9 pr-4 text-sm text-admin-text-primary placeholder:text-admin-text-tertiary focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-admin-border/50 bg-admin-surface-container text-sm text-admin-text-primary appearance-none focus:border-admin-brand focus:outline-none focus:ring-1 focus:ring-admin-brand transition-all min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Active</option>
              <option value="past">Inactive</option>
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
          Add Event
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
                title="No events found"
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
        title={editingItem ? 'Edit Event' : 'Create Event'}
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
            <AdminInput
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
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
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AdminInput
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Registration Link"
              type="url"
              value={formData.registerLink}
              onChange={(e) => setFormData({ ...formData, registerLink: e.target.value })}
              required
              placeholder="https://"
            />
            <AdminInput
              label="Poster Image URL"
              type="url"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
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
              Make this event active immediately
            </span>
          </label>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-admin-border/50">
            <AdminButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" variant="primary" loading={isSubmitting}>
              {editingItem ? 'Save Changes' : 'Create Event'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
