import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const MAX_POSTER_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function MediaStep() {
  const { formData, updateField } = useCreateEvent();
  const posterRef = useRef(null);
  const galleryRef = useRef(null);

  const handlePosterSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      e.target.value = '';
      return;
    }
    if (file.size > MAX_POSTER_SIZE) {
      e.target.value = '';
      return;
    }
    updateField('poster', file);
    const url = URL.createObjectURL(file);
    updateField('posterPreview', url);
  }, [updateField]);

  const handleGallerySelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_POSTER_SIZE);
    if (valid.length === 0) return;
    const newPreviews = valid.map(f => URL.createObjectURL(f));
    updateField('gallery', [...(formData.gallery || []), ...valid]);
    updateField('galleryPreviews', [...(formData.galleryPreviews || []), ...newPreviews]);
  }, [formData.gallery, formData.galleryPreviews, updateField]);

  const removeGalleryImage = useCallback((index) => {
    URL.revokeObjectURL(formData.galleryPreviews[index]);
    updateField('gallery', formData.gallery.filter((_, i) => i !== index));
    updateField('galleryPreviews', formData.galleryPreviews.filter((_, i) => i !== index));
  }, [formData.gallery, formData.galleryPreviews, updateField]);

  const removePoster = useCallback(() => {
    URL.revokeObjectURL(formData.posterPreview);
    updateField('poster', null);
    updateField('posterPreview', '');
  }, [formData.posterPreview, updateField]);

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      {/* Banner Poster */}
      <motion.div variants={fadeUp} custom={0}>
        <FieldWrapper fieldKey="poster" label="Event Poster" required>
        <div
          onClick={() => posterRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-300 group ${
            formData.posterPreview
              ? 'border-violet-500/30 bg-slate-900/40'
              : 'border-slate-700/40 bg-slate-900/30 hover:border-violet-500/30 hover:bg-slate-900/50'
          }`}
        >
          {formData.posterPreview ? (
            <>
              <img
                src={formData.posterPreview}
                alt="Poster preview"
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); posterRef.current?.click(); }}
                    className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-white text-xs font-bold border border-white/20 hover:bg-white/20 transition-all"
                  >
                    Replace
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removePoster(); }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 backdrop-blur-sm text-red-300 text-xs font-bold border border-red-500/30 hover:bg-red-500/30 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="aspect-[16/9] flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-300">Click to upload banner</p>
                <p className="text-xs text-slate-600 mt-1">PNG, JPG, WebP · Max 5MB · 1280×720 recommended</p>
              </div>
            </div>
          )}
          <input
            ref={posterRef}
            type="file"
            accept="image/*"
            onChange={handlePosterSelect}
            className="hidden"
          />
        </div>
        </FieldWrapper>
      </motion.div>

      {/* Gallery */}
      <motion.div variants={fadeUp} custom={1}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Gallery Images
            </label>
            <p className="text-[11px] text-slate-600 mt-0.5">Up to 10 images</p>
          </div>
          <span className="text-[11px] text-slate-600">
            {(formData.galleryPreviews || []).length}/10
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {formData.galleryPreviews?.map((preview, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-700/30 group"
            >
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => removeGalleryImage(i)}
                  className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}

          {(formData.galleryPreviews || []).length < 10 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => galleryRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-700/40 bg-slate-900/30 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-violet-500/30 hover:text-violet-400 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-[10px] font-medium">Add Image</span>
            </motion.button>
          )}
        </div>
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGallerySelect}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
}
