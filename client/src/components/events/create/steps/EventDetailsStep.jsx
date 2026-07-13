import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCreateEvent } from '../CreateEventContext';
import FieldWrapper from '../FieldWrapper';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SUGGESTED_TAGS = [
  'tech', 'AI', 'networking', 'music', 'food', 'startup', 'business',
  'fitness', 'art', 'photography', 'finance', 'education', 'health',
  'gaming', 'film', 'fashion', 'sustainability', 'career', 'design',
];

export default function EventDetailsStep() {
  const { formData, updateField, categories } = useCreateEvent();
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null);

  const addTag = useCallback((tag) => {
    const cleaned = tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleaned) return;
    if (formData.tags?.includes(cleaned)) return;
    if (formData.tags?.length >= 10) return;
    updateField('tags', [...(formData.tags || []), cleaned]);
    setTagInput('');
  }, [formData.tags, updateField]);

  const removeTag = useCallback((index) => {
    updateField('tags', formData.tags.filter((_, j) => j !== index));
  }, [formData.tags, updateField]);

  const handleTagKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && formData.tags?.length) {
      removeTag(formData.tags.length - 1);
    }
  }, [tagInput, addTag, removeTag, formData.tags]);

  const availableSuggestions = SUGGESTED_TAGS.filter(t => !formData.tags?.includes(t)).slice(0, 8);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Title */}
      <motion.div variants={fadeUp} custom={0}>
        <FieldWrapper fieldKey="title" label="Event Title" required>
          <div className="relative group">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Annual Tech Summit 2026"
              maxLength={200}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">
              {formData.title.length}/200
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/5 to-fuchsia-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Description */}
      <motion.div variants={fadeUp} custom={1}>
        <FieldWrapper fieldKey="description" label="Description" required>
          <div className="relative group">
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your event — what attendees can expect, highlights, and why they should attend..."
              rows={5}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 resize-none"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/5 to-fuchsia-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Category */}
      <motion.div variants={fadeUp} custom={2}>
        <FieldWrapper fieldKey="category" label="Category" required>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const isSelected = formData.category === cat;
              return (
                <motion.button
                  key={cat}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => updateField('category', cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium capitalize transition-all duration-300 border ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 shadow-lg shadow-violet-500/10'
                      : 'bg-slate-900/40 border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Location */}
      <motion.div variants={fadeUp} custom={3}>
        <FieldWrapper fieldKey="location" label="Location" required>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g. Convention Center, Bangalore"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/5 to-fuchsia-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Visibility */}
      <motion.div variants={fadeUp} custom={4}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Visibility
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'public', label: 'Public', desc: 'Visible to everyone', icon: '🌍' },
            { value: 'private', label: 'Private', desc: 'Invite-only', icon: '🔒' },
          ].map((opt) => (
            <motion.button
              key={opt.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateField('visibility', opt.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                formData.visibility === opt.value
                  ? 'bg-violet-600/10 border-violet-500/40 shadow-lg shadow-violet-500/10'
                  : 'bg-slate-900/30 border-slate-700/30 hover:border-slate-600/50'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <div className="text-left">
                <p className={`text-sm font-medium ${formData.visibility === opt.value ? 'text-violet-300' : 'text-slate-300'}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-slate-500">{opt.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div variants={fadeUp} custom={5}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Tags <span className="text-slate-600 font-normal normal-case">({(formData.tags || []).length}/10)</span>
        </label>

        {/* Current tags */}
        {formData.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {formData.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300 font-medium"
              >
                #{tag}
                <button
                  onClick={() => removeTag(i)}
                  className="ml-0.5 w-3.5 h-3.5 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400/60 hover:bg-red-500/30 hover:text-red-300 transition-all"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.span>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          onClick={() => tagInputRef.current?.focus()}
          className="relative group flex items-center flex-wrap gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40 cursor-text focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-300"
        >
          {(formData.tags || []).length === 0 && !tagInput && (
            <span className="absolute left-4 text-sm text-slate-600 pointer-events-none">
              Type and press Enter or comma to add
            </span>
          )}
          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => {
              const val = e.target.value;
              if (val.includes(',')) {
                const parts = val.split(',');
                parts.forEach((p, i) => { if (i < parts.length - 1) addTag(p); });
                setTagInput(parts[parts.length - 1]);
              } else {
                setTagInput(val);
              }
            }}
            onKeyDown={handleTagKeyDown}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput); setTagInput(''); }}
            maxLength={20}
            disabled={(formData.tags || []).length >= 10}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder:text-slate-600 outline-none disabled:opacity-50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">
            {(formData.tags || []).length}/10
          </div>
        </div>
        <p className="text-[10px] text-slate-700 mt-1.5">Press Enter, comma, or click away to add · Backspace to remove last</p>

        {/* Suggested tags */}
        {availableSuggestions.length > 0 && (formData.tags || []).length < 10 && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1.5">Suggested</p>
            <div className="flex flex-wrap gap-1.5">
              {availableSuggestions.map((tag) => (
                <motion.button
                  key={tag}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addTag(tag)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/30 text-[11px] text-slate-500 font-medium hover:border-violet-500/30 hover:text-violet-300 hover:bg-violet-500/5 transition-all"
                >
                  + {tag}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
