'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineExclamationTriangle,
  HiOutlineBookOpen,
  HiOutlineLink,
} from 'react-icons/hi2';
import { mockResources } from '@/data/mock';
import type { Resource, ResourceCategory } from '@/types';

const categories: ResourceCategory[] = [
  'Roadmaps',
  'PDFs',
  'Learning',
  'GitHub Repos',
  'Career Prep',
  'Tools',
];

const types = ['pdf', 'link', 'repo', 'video'] as const;

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Learning');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<'pdf' | 'link' | 'repo' | 'video'>('link');
  const [icon, setIcon] = useState('📖');

  // Load from localStorage or mock data
  useEffect(() => {
    const saved = localStorage.getItem('sh_resources');
    if (saved) {
      try {
        setResources(JSON.parse(saved));
      } catch (e) {
        setResources(mockResources);
      }
    } else {
      setResources(mockResources);
      localStorage.setItem('sh_resources', JSON.stringify(mockResources));
    }
  }, []);

  const saveResources = (updated: Resource[]) => {
    setResources(updated);
    localStorage.setItem('sh_resources', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Filter logic
  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const openAddModal = () => {
    setEditingResource(null);
    setTitle('');
    setCategory('Learning');
    setDescription('');
    setLink('');
    setType('link');
    setIcon('📖');
    setIsFormOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingResource(res);
    setTitle(res.title);
    setCategory(res.category);
    setDescription(res.description);
    setLink(res.link);
    setType(res.type);
    setIcon(res.icon || '📖');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !link.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    // Assign appropriate emoji icon based on type/category if not edited
    let finalIcon = icon;
    if (finalIcon === '📖' || !finalIcon) {
      if (type === 'repo') finalIcon = '💻';
      else if (type === 'pdf') finalIcon = '📄';
      else if (type === 'video') finalIcon = '🎥';
      else if (category === 'Roadmaps') finalIcon = '🗺️';
      else if (category === 'Career Prep') finalIcon = '🎯';
      else if (category === 'Tools') finalIcon = '🔧';
      else finalIcon = '📖';
    }

    if (editingResource) {
      // Edit
      const updated = resources.map((r) =>
        r.id === editingResource.id
          ? {
              ...r,
              title,
              category,
              description,
              link,
              type,
              icon: finalIcon,
            }
          : r
      );
      saveResources(updated);
    } else {
      // Add
      const newResource: Resource = {
        id: `res_${Date.now()}`,
        title,
        category,
        description,
        link,
        type,
        icon: finalIcon,
        createdAt: new Date().toISOString(),
      };
      saveResources([newResource, ...resources]);
    }
    setIsFormOpen(false);
  };

  const openDeleteModal = (res: Resource) => {
    setDeletingResource(res);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingResource) {
      const updated = resources.filter((r) => r.id !== deletingResource.id);
      saveResources(updated);
      setIsDeleteOpen(false);
      setDeletingResource(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display sm:text-3xl">
            Resources
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Manage learning links, PDF guides, GitHub repos, and career resources.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Add Resource
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-container py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            <option value="All">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        {filteredResources.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-container/50 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Link</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-secondary">
                {filteredResources.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-surface-container/30 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="text-2xl" role="img" aria-label="icon">
                        {res.icon || '📖'}
                      </span>
                      <div>
                        <div className="font-semibold text-text-primary">{res.title}</div>
                        <div className="text-xs text-text-tertiary max-w-sm truncate">
                          {res.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                        {res.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase font-medium text-xs text-text-tertiary">
                      {res.type}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-teal hover:underline"
                      >
                        <HiOutlineLink className="h-3.5 w-3.5" />
                        Visit Link
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(res)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-container hover:text-text-primary transition-colors"
                        title="Edit Resource"
                      >
                        <HiOutlinePencilSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(res)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete Resource"
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
            <p className="text-text-secondary font-medium">No resources match the criteria.</p>
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
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-xl max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-display text-xl font-bold text-text-primary">
                  {editingResource ? 'Edit Resource' : 'Add Resource'}
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
                      Resource Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Master Git & GitHub Roadmap"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    >
                      {types.map((t) => (
                        <option key={t} value={t}>
                          {t.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Resource Link (URL)
                    </label>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://github.com/... or https://youtube.com/..."
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Display Emoji/Icon
                    </label>
                    <input
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="📖"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-center"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-text-tertiary mt-8">
                      Provide a single emoji to display alongside the resource title.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what this resource covers and who it is for..."
                    className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
                    required
                  />
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
                    className="rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-purple-600/20"
                  >
                    {editingResource ? 'Save Changes' : 'Create Resource'}
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
                    Delete Resource
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Are you sure you want to delete <span className="font-semibold text-text-primary">&ldquo;{deletingResource?.title}&rdquo;</span>? This action cannot be undone.
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
