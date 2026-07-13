import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetEventByIdQuery, useUpdateEventMutation } from '../../features/events/eventsApi';
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

function toDatetimeLocal(date) {
  if (!date) return '';
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: eventData, isLoading: loadingEvent } = useGetEventByIdQuery(eventId);
  const [updateEvent, { isLoading }] = useUpdateEventMutation();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', description: '', category: 'conference', location: '',
    price: '', startDate: '', endDate: '', registrationDeadline: '',
    maxParticipants: '', eventType: 'solo', teamSize: '', minTeamSize: '',
    visibility: 'public', status: 'published',
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  useEffect(() => {
    if (eventData) {
      setForm({
        title: eventData.title || '',
        description: eventData.description || '',
        category: eventData.category || 'conference',
        location: eventData.location || eventData.venue?.name || '',
        price: eventData.price?.toString() || '',
        startDate: toDatetimeLocal(eventData.startDate),
        endDate: toDatetimeLocal(eventData.endDate),
        registrationDeadline: toDatetimeLocal(eventData.registrationDeadline),
        maxParticipants: eventData.maxParticipants?.toString() || '',
        eventType: eventData.eventType || 'solo',
        teamSize: eventData.teamSize?.toString() || '',
        minTeamSize: eventData.minTeamSize?.toString() || '',
        visibility: eventData.visibility || 'public',
        status: eventData.status || 'published',
      });
      if (eventData.poster || eventData.bannerImage) {
        setPosterPreview(eventData.poster || eventData.bannerImage);
      }
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    fd.append('status', form.status);
    if (form.eventType === 'team') {
      fd.append('teamSize', form.teamSize);
      if (form.minTeamSize) fd.append('minTeamSize', form.minTeamSize);
    }
    if (posterFile) fd.append('bannerImage', posterFile);

    try {
      await updateEvent({ id: eventId, formData: fd }).unwrap();
      toast.success('Event updated!');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  if (loadingEvent) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-display">Edit Event</h1>
        <p className="text-zinc-400 text-sm mt-1">Update event details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Event Name</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="input resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Venue/Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Poster</label>
          <div onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-white/[0.08] rounded-2xl p-6 text-center cursor-pointer hover:border-violet-500/40 transition-all">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePosterSelect} className="hidden" />
            {posterPreview ? (
              <div className="relative inline-block">
                <img src={posterPreview} alt="" className="max-h-40 rounded-xl" />
                <button type="button" onClick={(e) => { e.stopPropagation(); setPosterFile(null); setPosterPreview(eventData?.poster || eventData?.bannerImage || null); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs">✕</button>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">Click to upload poster</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Price (₹)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} min="0" className="input" />
          </div>
          <div>
            <label className="label">Max Participants</label>
            <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} min="1" className="input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Registration Deadline</label>
            <input type="datetime-local" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Event Type</label>
          <div className="flex gap-4">
            {['solo', 'team'].map((type) => (
              <label key={type} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                form.eventType === type ? 'border-violet-500/50 bg-violet-500/10 text-violet-300' : 'border-white/[0.06] text-zinc-400'
              }`}>
                <input type="radio" name="eventType" value={type} checked={form.eventType === type} onChange={handleChange} className="sr-only" />
                <span className="text-lg">{type === 'solo' ? '👤' : '👥'}</span>
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {form.eventType === 'team' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Team Size</label>
              <input type="number" name="teamSize" value={form.teamSize} onChange={handleChange} min="2" className="input" />
            </div>
            <div>
              <label className="label">Min Team Size</label>
              <input type="number" name="minTeamSize" value={form.minTeamSize} onChange={handleChange} min="1" className="input" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Visibility</label>
            <select name="visibility" value={form.visibility} onChange={handleChange} className="input">
              <option value="public">🌍 Public</option>
              <option value="private">🔒 Private</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
          <button type="button" onClick={() => navigate('/organizer/events')} className="btn-md btn-secondary">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-md btn-primary flex-1 sm:flex-none">
            {isLoading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
