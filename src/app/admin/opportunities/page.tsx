'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineXMark,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineExclamationTriangle,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { mockOpportunities } from '@/data/mock';
import type { Opportunity, OpportunityCategory } from '@/types';

const categories: OpportunityCategory[] = [
  'Hackathon',
  'Internship',
  'Workshop',
  'Scholarship',
  'Job',
  'Open Source',
  'Coding Contest',
  'Campus Ambassador',
  'Fellowship',
];

const modes = ['online', 'offline', 'hybrid'] as const;

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [deletingOpp, setDeletingOpp] = useState<Opportunity | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('Hackathon');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [platform, setPlatform] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('online');
  const [isActive, setIsActive] = useState(true);

  // Load from localStorage or mock data
  useEffect(() => {
    const saved = localStorage.getItem('sh_opportunities');
    if (saved) {
      try {
        setOpportunities(JSON.parse(saved));
      } catch (e) {
        setOpportunities(mockOpportunities);
      }
    } else {
      setOpportunities(mockOpportunities);
      localStorage.setItem('sh_opportunities', JSON.stringify(mockOpportunities));
    }
  }, []);

  const saveOpportunities = (updated: Opportunity[]) => {
    setOpportunities(updated);
    localStorage.setItem('sh_opportunities', JSON.stringify(updated));
    // Trigger storage event for cross-tab sync or component refresh
    window.dispatchEvent(new Event('storage'));
  };

  // Filter logic
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) || 
                          opp.platform.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || opp.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && opp.isActive) || 
      (statusFilter === 'Inactive' && !opp.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openAddModal = () => {
    setEditingOpp(null);
    setTitle('');
    setCategory('Hackathon');
    setLocation('');
    setDeadline('');
    setPlatform('');
    setApplyLink('');
    setDescription('');
    setMode('online');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const openEditModal = (opp: Opportunity) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setCategory(opp.category);
    setLocation(opp.location);
    setDeadline(opp.deadline.split('T')[0]); // format for input[type="date"]
    setPlatform(opp.platform);
    setApplyLink(opp.applyLink);
    setDescription(opp.description);
    setMode(opp.mode);
    setIsActive(opp.isActive);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !deadline || !platform.trim() || !applyLink.trim() || !description.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    if (editingOpp) {
      // Edit
      const updated = opportunities.map((o) =>
        o.id === editingOpp.id
          ? {
              ...o,
              title,
              category,
              location,
              deadline,
              platform,
              applyLink,
              description,
              mode,
              isActive,
            }
          : o
      );
      saveOpportunities(updated);
    } else {
      // Add
      const newOpp: Opportunity = {
        id: `opp_${Date.now()}`,
        title,
        category,
        location,
        deadline,
        platform,
        applyLink,
        description,
        mode,
        isActive,
        createdAt: new Date().toISOString(),
      };
      saveOpportunities([newOpp, ...opportunities]);
    }
    setIsFormOpen(false);
  };

  const handleToggleActive = (opp: Opportunity) => {
    const updated = opportunities.map((o) =>
      o.id === opp.id ? { ...o, isActive: !o.isActive } : o
    );
    saveOpportunities(updated);
  };

  const openDeleteModal = (opp: Opportunity) => {
    setDeletingOpp(opp);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingOpp) {
      const updated = opportunities.filter((o) => o.id !== deletingOpp.id);
      saveOpportunities(updated);
      setIsDeleteOpen(false);
      setDeletingOpp(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display sm:text-3xl">
            Opportunities
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Manage hackathons, internships, scholarships, and contests for the community.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-teal/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Add Opportunity
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-container py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        {filteredOpportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-container/50 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-secondary">
                {filteredOpportunities.map((opp) => (
                  <tr
                    key={opp.id}
                    className="hover:bg-surface-container/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text-primary">{opp.title}</div>
                      <div className="text-xs text-text-tertiary">{opp.platform}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-brand-teal/10 px-2.5 py-1 text-xs font-semibold text-brand-teal">
                        {opp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{opp.location}</td>
                    <td className="px-6 py-4">
                      {new Date(opp.deadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 capitalize">{opp.mode}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(opp)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          opp.isActive
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {opp.isActive ? (
                          <>
                            <HiOutlineEye className="h-3.5 w-3.5" /> Active
                          </>
                        ) : (
                          <>
                            <HiOutlineEyeSlash className="h-3.5 w-3.5" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(opp)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-container hover:text-text-primary transition-colors"
                        title="Edit Opportunity"
                      >
                        <HiOutlinePencilSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(opp)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete Opportunity"
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
            <p className="text-text-secondary font-medium">No opportunities match the criteria.</p>
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
                  {editingOpp ? 'Edit Opportunity' : 'Add Opportunity'}
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
                      Opportunity Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Smart India Hackathon"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
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
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, Karnataka"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Mode
                    </label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                    >
                      {modes.map((m) => (
                        <option key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Hosting Organization / Platform
                    </label>
                    <input
                      type="text"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="e.g. AICTE, Google, Devfolio"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Apply / Registration Link
                    </label>
                    <input
                      type="url"
                      value={applyLink}
                      onChange={(e) => setApplyLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                      required
                    />
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
                    placeholder="Provide details about requirements, prizes, eligibility, and process..."
                    className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="opp-status"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-surface-container text-brand-teal focus:ring-brand-teal"
                  />
                  <label htmlFor="opp-status" className="text-sm font-medium text-text-secondary select-none">
                    Make this opportunity visible immediately
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
                    className="rounded-xl bg-brand-teal hover:bg-brand-teal-dark px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-brand-teal/20"
                  >
                    {editingOpp ? 'Save Changes' : 'Create Opportunity'}
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
                    Delete Opportunity
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Are you sure you want to delete <span className="font-semibold text-text-primary">&ldquo;{deletingOpp?.title}&rdquo;</span>? This action cannot be undone.
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
