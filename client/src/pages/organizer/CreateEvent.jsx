import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCreateEventMutation } from '../../features/events/eventsApi';
import toast from 'react-hot-toast';

const categories = [
  { value: 'conference', label: 'Conference' },
  { value: 'concert', label: 'Concert' },
  { value: 'festival', label: 'Festival' },
  { value: 'sports', label: 'Sports' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'networking', label: 'Networking' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'other', label: 'Other' },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'conference',
    location: '',
    price: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: '',
    eventType: 'solo',
    teamSize: '',
    minTeamSize: '',
    visibility: 'public',
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePosterSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image size must be less than 5MB'); return; }
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) toast.error('Some files were skipped (invalid type or >5MB)');
    setGalleryFiles((prev) => [...prev, ...valid]);
    setGalleryPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (idx) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Event name is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.location.trim()) errs.location = 'Venue/Location is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      errs.endDate = 'End date must be after start date';
    }
    if (form.registrationDeadline && form.startDate && new Date(form.registrationDeadline) >= new Date(form.startDate)) {
      errs.registrationDeadline = 'Registration deadline cannot be after event start date';
    }
    if (!posterFile) errs.poster = 'Event poster is required';
    if (form.price && parseFloat(form.price) < 0) errs.price = 'Price cannot be negative';
    if (form.eventType === 'team') {
      if (!form.teamSize || parseInt(form.teamSize) < 2) errs.teamSize = 'Team size must be at least 2';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('description', form.description.trim());
    fd.append('category', form.category);
    fd.append('location', form.location.trim());
    fd.append('price', form.price || '0');
    fd.append('startDate', form.startDate);
    fd.append('endDate', form.endDate);
    if (form.registrationDeadline) fd.append('registrationDeadline', form.registrationDeadline);
    if (form.maxParticipants) fd.append('maxParticipants', form.maxParticipants);
    fd.append('eventType', form.eventType);
    fd.append('visibility', form.visibility);
    if (form.eventType === 'team') {
      fd.append('teamSize', form.teamSize);
      if (form.minTeamSize) fd.append('minTeamSize', form.minTeamSize);
    }
    if (posterFile) fd.append('bannerImage', posterFile);
    galleryFiles.forEach((f) => fd.append('gallery', f));

    try {
      const res = await createEvent(fd).unwrap();
      toast.success('Event created successfully!');
      navigate(`/organizer/events/${res._id || res.id}/manage`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create event');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">Create Event</h1>
        <p className="text-zinc-400 text-sm mt-1">Set up a new event for your audience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Event Name <span className="text-red-400">*</span></label>
          <input type="text" name="title" value={form.title} onChange={handleChange}
            placeholder="Enter event name" className={`input ${errors.title ? 'input-error' : ''}`} />
          {errors.title && <p className="error-msg">{errors.title}</p>}
        </div>

        <div>
          <label className="label">Description <span className="text-red-400">*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Describe your event..." rows={5}
            className={`input resize-none ${errors.description ? 'input-error' : ''}`} />
          {errors.description && <p className="error-msg">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Category <span className="text-red-400">*</span></label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Venue/Location <span className="text-red-400">*</span></label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Mumbai, India" className={`input ${errors.location ? 'input-error' : ''}`} />
            {errors.location && <p className="error-msg">{errors.location}</p>}
          </div>
        </div>

        <div>
          <label className="label">Event Poster <span className="text-red-400">*</span></label>
          <div onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-violet-500/40 transition-all group ${errors.poster ? 'border-red-400/50' : 'border-white/[0.08]'}`}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePosterSelect} className="hidden" />
            {posterPreview ? (
              <div className="relative inline-block">
                <img src={posterPreview} alt="" className="max-h-48 mx-auto rounded-xl object-contain" />
                <button type="button" onClick={(e) => { e.stopPropagation(); removePoster(); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-400">✕</button>
              </div>
            ) : (
              <div className="text-zinc-500">
                <span className="text-3xl block mb-2">🖼</span>
                <p className="text-sm">Click to upload poster</p>
                <p className="text-xs mt-1">PNG, JPG, WebP up to 5MB (required)</p>
              </div>
            )}
          </div>
          {errors.poster && <p className="error-msg">{errors.poster}</p>}
        </div>

        <div>
          <label className="label">Additional Images <span className="text-zinc-500">(optional)</span></label>
          <div onClick={() => galleryInputRef.current?.click()}
            className="border-2 border-dashed border-white/[0.08] rounded-2xl p-6 text-center cursor-pointer hover:border-violet-500/40 transition-all group">
            <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGallerySelect} className="hidden" />
            <span className="text-2xl block mb-1">🖼️</span>
            <p className="text-sm text-zinc-500">Click to add more images</p>
            <p className="text-xs text-zinc-600 mt-0.5">PNG, JPG, WebP up to 5MB each (max 10)</p>
          </div>
          {galleryPreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
              {galleryPreviews.map((url, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-white/[0.06] aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImage(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] hover:bg-red-400 flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Ticket Price (₹) <span className="text-zinc-500">(0 = Free)</span></label>
            <input type="number" name="price" value={form.price} onChange={handleChange}
              placeholder="0" min="0" className={`input ${errors.price ? 'input-error' : ''}`} />
            {errors.price && <p className="error-msg">{errors.price}</p>}
          </div>
          <div>
            <label className="label">Maximum Participants</label>
            <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange}
              placeholder="Unlimited" min="1" className="input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Start Date & Time <span className="text-red-400">*</span></label>
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange}
              className={`input ${errors.startDate ? 'input-error' : ''}`} />
            {errors.startDate && <p className="error-msg">{errors.startDate}</p>}
          </div>
          <div>
            <label className="label">End Date & Time <span className="text-red-400">*</span></label>
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange}
              className={`input ${errors.endDate ? 'input-error' : ''}`} />
            {errors.endDate && <p className="error-msg">{errors.endDate}</p>}
          </div>
          <div>
            <label className="label">Registration Deadline</label>
            <input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange}
              className={`input ${errors.registrationDeadline ? 'input-error' : ''}`} />
            {errors.registrationDeadline && <p className="error-msg">{errors.registrationDeadline}</p>}
          </div>
        </div>

        <div>
          <label className="label">Event Type <span className="text-red-400">*</span></label>
          <div className="flex gap-4">
            {['solo', 'team'].map((type) => (
              <label key={type} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                form.eventType === type ? 'border-violet-500/50 bg-violet-500/10 text-violet-300' : 'border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-zinc-200'
              }`}>
                <input type="radio" name="eventType" value={type} checked={form.eventType === type} onChange={handleChange} className="sr-only" />
                <span className="text-lg">{type === 'solo' ? '👤' : '👥'}</span>
                <span className="text-sm font-medium capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {form.eventType === 'team' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Team Size <span className="text-red-400">*</span></label>
              <input type="number" name="teamSize" value={form.teamSize} onChange={handleChange}
                placeholder="e.g. 4" min="2" className={`input ${errors.teamSize ? 'input-error' : ''}`} />
              {errors.teamSize && <p className="error-msg">{errors.teamSize}</p>}
            </div>
            <div>
              <label className="label">Minimum Team Size</label>
              <input type="number" name="minTeamSize" value={form.minTeamSize} onChange={handleChange}
                placeholder="e.g. 2" min="1" className="input" />
            </div>
          </motion.div>
        )}

        <div>
          <label className="label">Visibility</label>
          <div className="flex gap-4">
            {[ { value: 'public', icon: '🌍', label: 'Public' }, { value: 'private', icon: '🔒', label: 'Private' } ].map((opt) => (
              <label key={opt.value} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                form.visibility === opt.value ? 'border-violet-500/50 bg-violet-500/10 text-violet-300' : 'border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-zinc-200'
              }`}>
                <input type="radio" name="visibility" value={opt.value} checked={form.visibility === opt.value} onChange={handleChange} className="sr-only" />
                <span>{opt.icon}</span>
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
          <button type="button" onClick={() => navigate('/organizer/events')} className="btn-md btn-secondary">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-md btn-primary flex-1 sm:flex-none">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : '🎉 Create Event'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
