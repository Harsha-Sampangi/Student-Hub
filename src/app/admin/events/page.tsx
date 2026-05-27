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
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { fetchCollection, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import type { Event } from '@/types';

const modes = ['online', 'offline', 'hybrid'] as const;

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState<'online' | 'offline' | 'hybrid'>('online');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [registerLink, setRegisterLink] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await fetchCollection<Event>('events');
      setEvents(data);
    } catch (e) {
      console.error('Failed to load events:', e);
    }
  };

  // Load from database
  useEffect(() => {
    loadEvents();
  }, []);

  // Filter logic
  const filteredEvents = events.filter((e) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.location.toLowerCase().includes(search.toLowerCase());
    const matchesMode = modeFilter === 'All' || e.mode === modeFilter;
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Active' && e.isActive) || 
      (statusFilter === 'Inactive' && !e.isActive);
    return matchesSearch && matchesMode && matchesStatus;
  });

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDate('');
    setMode('online');
    setLocation('');
    setDescription('');
    setRegisterLink('');
    setPosterUrl('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const openEditModal = (evt: Event) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date.split('T')[0]); // format for input[type="date"]
    setMode(evt.mode);
    setLocation(evt.location);
    setDescription(evt.description);
    setRegisterLink(evt.registerLink);
    setPosterUrl(evt.posterUrl || '');
    setIsActive(evt.isActive);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date || !location.trim() || !description.trim() || !registerLink.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      title,
      date,
      mode,
      location,
      description,
      registerLink,
      posterUrl,
      isActive,
    };

    if (editingEvent) {
      // Edit
      await updateDocument('events', editingEvent.id, payload);
    } else {
      // Add
      await addDocument('events', payload);
    }
    await loadEvents();
    setIsFormOpen(false);
  };

  const handleToggleActive = async (evt: Event) => {
    await updateDocument('events', evt.id, { isActive: !evt.isActive });
    await loadEvents();
  };

  const openDeleteModal = (evt: Event) => {
    setDeletingEvent(evt);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingEvent) {
      await deleteDocument('events', deletingEvent.id);
      await loadEvents();
      setIsDeleteOpen(false);
      setDeletingEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary font-display sm:text-3xl">
            Events
          </h2>
          <p className="mt-1 text-sm text-text-tertiary">
            Manage upcoming meetups, workshops, hackathons, and AI demo days.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-amber hover:bg-brand-amber-dark px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-amber/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <HiOutlinePlus className="h-5 w-5" />
          Add Event
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search events by title/location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-container py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-amber/30 focus:border-brand-amber transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
          >
            <option value="All">All Modes</option>
            {modes.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-surface-container px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border">
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-container/50 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-secondary">
                {filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-surface-container/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text-primary">{evt.title}</div>
                      <div className="text-xs text-text-tertiary">
                        {evt.registerLink.substring(0, 30)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCalendarDays className="h-4 w-4 text-text-tertiary" />
                        <span>
                          {new Date(evt.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{evt.mode}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <HiOutlineMapPin className="h-4 w-4 text-text-tertiary" />
                        <span>{evt.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(evt)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                          evt.isActive
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {evt.isActive ? (
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
                        onClick={() => openEditModal(evt)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-container hover:text-text-primary transition-colors"
                        title="Edit Event"
                      >
                        <HiOutlinePencilSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(evt)}
                        className="rounded-lg p-1.5 text-text-tertiary hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete Event"
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
            <p className="text-text-secondary font-medium">No events match the criteria.</p>
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
                  {editingEvent ? 'Edit Event' : 'Add Event'}
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
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Next.js Developer Meetup"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30 focus:border-brand-amber"
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
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
                    >
                      {modes.map((m) => (
                        <option key={m} value={m}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Outer Ring Road, Bengaluru / Zoom link"
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Registration Link
                    </label>
                    <input
                      type="url"
                      value={registerLink}
                      onChange={(e) => setRegisterLink(e.target.value)}
                      placeholder="https://lu.ma/..."
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-1.5">
                      Poster Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30"
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
                    placeholder="Describe what students will learn, who is speaking, and prerequisites..."
                    className="w-full rounded-xl border border-border bg-surface-container px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-amber/30 focus:border-brand-amber resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="event-status"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-surface-container text-brand-amber focus:ring-brand-amber"
                  />
                  <label htmlFor="event-status" className="text-sm font-medium text-text-secondary select-none">
                    Make this event active immediately
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
                    className="rounded-xl bg-brand-amber hover:bg-brand-amber-dark px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-md shadow-brand-amber/20"
                  >
                    {editingEvent ? 'Save Changes' : 'Create Event'}
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
                    Delete Event
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    Are you sure you want to delete <span className="font-semibold text-text-primary">&ldquo;{deletingEvent?.title}&rdquo;</span>? This action cannot be undone.
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
