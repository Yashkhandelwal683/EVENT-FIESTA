import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCreateEventMutation, useUpdateEventMutation } from '../../features/events/eventsApi';
import { CreateEventProvider, useCreateEvent } from '../../components/events/create/CreateEventContext';
import StepTimeline from '../../components/events/create/StepTimeline';
import TopProgressBar from '../../components/events/create/TopProgressBar';
import LivePreview from '../../components/events/create/LivePreview';
import EventDetailsStep from '../../components/events/create/steps/EventDetailsStep';
import ParticipationStep from '../../components/events/create/steps/ParticipationStep';
import TicketStep from '../../components/events/create/steps/TicketStep';
import ScheduleStep from '../../components/events/create/steps/ScheduleStep';
import MediaStep from '../../components/events/create/steps/MediaStep';
import ReviewStep from '../../components/events/create/steps/ReviewStep';
import { Check, Clock, Save, ChevronLeft, ChevronRight, Rocket, ArrowLeft } from 'lucide-react';

const STEP_COMPONENTS = [
  EventDetailsStep,
  ParticipationStep,
  TicketStep,
  ScheduleStep,
  MediaStep,
  ReviewStep,
];

function SaveStatus({ lastSaved }) {
  if (!lastSaved) return null;
  const now = new Date();
  const diff = Math.floor((now - lastSaved) / 1000);
  let text = 'Saved';
  if (diff < 5) text = 'Saved just now';
  else if (diff < 60) text = `Saved ${diff}s ago`;
  else text = `Saved ${Math.floor(diff / 60)}m ago`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-[11px] text-emerald-400/70"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {text}
    </motion.div>
  );
}

function StepCelebration({ step }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4 backdrop-blur-sm shadow-2xl">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-emerald-400" strokeWidth={3} />
          </motion.div>
          <div>
            <p className="text-sm font-bold text-emerald-300">Step Completed!</p>
            <p className="text-[11px] text-emerald-400/60">Moving to next step...</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CreateEventInner() {
  const navigate = useNavigate();
  const {
    steps, currentStep, formData,
    nextStep, prevStep, goToStep, touchStep,
    stepErrors, isCurrentStepValid, touchedSteps,
    isSaving, isPublishing, setIsSaving, setIsPublishing,
    lastSaved, setLastSaved, stepCelebration,
    allStepsCompleted, completedSections, progress, getStepFieldStatus, clearDraft,
  } = useCreateEvent();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const autoSaveTimer = useRef(null);
  const formModified = useRef(false);
  const draftEventId = useRef(null);
  const handleAutoSaveRef = useRef(null);

  useEffect(() => {
    formModified.current = true;
  }, [formData]);

  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      if (formModified.current && handleAutoSaveRef.current) {
        handleAutoSaveRef.current();
        formModified.current = false;
      }
    }, 15000);
    return () => clearInterval(autoSaveTimer.current);
  }, []);

  const buildFormDataPayload = useCallback((includeFiles = true) => {
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description || '');
    fd.append('category', formData.category || '');
    fd.append('location', formData.location || '');
    fd.append('price', String(formData.price || 0));
    fd.append('eventType', formData.eventType || 'solo');
    fd.append('visibility', formData.visibility || 'public');
    if (formData.startDate) fd.append('startDate', new Date(formData.startDate).toISOString());
    if (formData.endDate) fd.append('endDate', new Date(formData.endDate).toISOString());
    if (formData.registrationDeadline) fd.append('registrationDeadline', new Date(formData.registrationDeadline).toISOString());
    if (formData.maxParticipants) fd.append('maxParticipants', formData.maxParticipants);
    if (formData.eventType === 'team') {
      if (formData.teamSize) fd.append('teamSize', formData.teamSize);
      if (formData.minTeamSize) fd.append('minTeamSize', formData.minTeamSize);
    }
    if (includeFiles) {
      if (formData.poster) fd.append('bannerImage', formData.poster);
      if (formData.gallery?.length) {
        formData.gallery.forEach((f) => fd.append('gallery', f));
      }
    }
    if (formData.tags?.length) fd.append('tags', JSON.stringify(formData.tags));
    fd.append('tickets', JSON.stringify(formData.tickets?.length ? formData.tickets : []));
    if (formData.schedule?.length) fd.append('schedule', JSON.stringify(formData.schedule));
    return fd;
  }, [formData]);

  const buildFormData = buildFormDataPayload;

  const handleAutoSave = useCallback(async () => {
    if (!formData.title?.trim()) return;
    if (!formData.category) return;
    if (!formData.eventType) return;
    try {
      if (draftEventId.current) {
        const fd = buildFormDataPayload(true);
        await updateEvent({ id: draftEventId.current, formData: fd }).unwrap();
      } else {
        const fd = buildFormDataPayload(false);
        fd.append('status', 'draft');
        const res = await createEvent(fd).unwrap();
        draftEventId.current = res._id;
      }
      setLastSaved(new Date());
    } catch (err) {
      // silent fail for auto-save
    }
  }, [formData]);

  // Keep ref in sync with latest handleAutoSave
  useEffect(() => {
    handleAutoSaveRef.current = handleAutoSave;
  }, [handleAutoSave]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      if (draftEventId.current) {
        const fd = buildFormDataPayload(true);
        await updateEvent({ id: draftEventId.current, formData: fd }).unwrap();
      } else {
        const fd = buildFormDataPayload(false);
        fd.append('status', 'draft');
        const res = await createEvent(fd).unwrap();
        draftEventId.current = res._id;
      }
      setLastSaved(new Date());
      toast.success('Draft saved!');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  }, [buildFormDataPayload, createEvent, updateEvent, navigate, setIsSaving, setLastSaved]);

  const handlePublish = useCallback(async () => {
    if (!formData.title?.trim()) { toast.error('Event title is required'); goToStep(0); return; }
    if (!formData.description?.trim()) { toast.error('Event description is required'); goToStep(0); return; }
    if (!formData.category) { toast.error('Please select a category'); goToStep(0); return; }
    if (!formData.location?.trim()) { toast.error('Location is required'); goToStep(0); return; }
    if (!formData.eventType) { toast.error('Select a participation type'); goToStep(1); return; }
    if (!formData.tickets?.some(t => t.name?.trim())) { toast.error('Add at least one ticket type'); goToStep(2); return; }
    if (!formData.startDate) { toast.error('Start date is required'); goToStep(3); return; }
    if (!formData.poster) { toast.error('Event poster is required'); goToStep(4); return; }

    setIsPublishing(true);
    try {
      let res;
      if (draftEventId.current) {
        const fd = buildFormDataPayload(true);
        fd.append('status', 'published');
        res = await updateEvent({ id: draftEventId.current, formData: fd }).unwrap();
      } else {
        const fd = buildFormDataPayload(true);
        fd.append('status', 'published');
        res = await createEvent(fd).unwrap();
      }
      clearDraft();
      toast.success('Event published successfully!');
      navigate(`/organizer/events/${res._id}/manage`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to publish event');
    } finally {
      setIsPublishing(false);
    }
  }, [formData, buildFormDataPayload, createEvent, updateEvent, navigate, setIsPublishing, goToStep, clearDraft]);

  const StepComponent = STEP_COMPONENTS[currentStep];
  const remainingSections = steps.length - completedSections;
  const estimatedMinutes = Math.max(1, Math.ceil(remainingSections * 0.5));

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-fuchsia-600/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-purple-600/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/organizer/events')}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Create <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Event</span>
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-slate-500">Build your event in {steps.length} steps</p>
                  <SaveStatus lastSaved={lastSaved} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-300 text-xs font-semibold hover:border-violet-500/30 transition-all"
              >
                Preview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/organizer/events')}
                className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-300 text-xs font-semibold hover:border-slate-600/50 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>

          <div className="mt-4">
            <TopProgressBar />
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
          {/* Left: Step Timeline */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:block"
          >
            <div className="sticky top-6">
              <div className="rounded-2xl bg-slate-900/30 border border-slate-800/30 p-4 backdrop-blur-sm">
                <StepTimeline />
              </div>

              {/* Quick Actions */}
              <div className="mt-4 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-300 text-xs font-semibold hover:border-slate-600/50 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Draft
                </motion.button>
              </div>
            </div>
          </motion.aside>

          {/* Center: Step Content */}
          <motion.main
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/30 p-6 sm:p-8 backdrop-blur-sm min-h-[500px]">
              {/* Step Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg transition-all ${
                    getStepFieldStatus(currentStep) === 'completed'
                      ? 'bg-emerald-500/20 shadow-emerald-500/10'
                      : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-violet-500/20'
                  }`}>
                    {getStepFieldStatus(currentStep) === 'completed' ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      currentStep + 1
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{steps[currentStep].label}</h2>
                    <p className="text-[11px] text-slate-500">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>
                  {getStepFieldStatus(currentStep) === 'completed' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    >
                      ✓ Completed
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StepComponent />
                </motion.div>
              </AnimatePresence>

              {/* Validation Errors — shown only after touch */}
              <AnimatePresence>
                {touchedSteps.has(currentStep) && stepErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-amber-400">Please complete the following:</span>
                      </div>
                      {stepErrors.map((err, i) => (
                        <motion.p
                          key={err}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-xs text-amber-400/70 pl-4"
                        >
                          • {err}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800/30">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-300 text-xs font-semibold hover:border-slate-600/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </motion.button>

                <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-600">
                  <Clock className="w-3 h-3" />
                  <span>~{estimatedMinutes} min left</span>
                </div>

                {currentStep === steps.length - 1 ? (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-300 text-xs font-semibold hover:border-slate-600/50 transition-all disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ) : 'Save as Draft'}
                    </motion.button>
                    <motion.button
                      whileHover={allStepsCompleted ? { scale: 1.03, boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)' } : {}}
                      whileTap={allStepsCompleted ? { scale: 0.97 } : {}}
                      onClick={handlePublish}
                      disabled={isPublishing || !allStepsCompleted}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        allStepsCompleted
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20'
                          : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'
                      }`}
                    >
                      {isPublishing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4" />
                          Publish Event
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <motion.button
                      whileHover={isCurrentStepValid ? { scale: 1.03 } : {}}
                      whileTap={isCurrentStepValid ? { scale: 0.97 } : {}}
                      onClick={() => {
                        touchStep(currentStep);
                        if (isCurrentStepValid) nextStep();
                      }}
                      disabled={!isCurrentStepValid}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        isCurrentStepValid
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-violet-500/20 hover:shadow-violet-500/30'
                          : 'bg-slate-800/50 text-slate-500 border border-slate-700/30'
                      }`}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                    {!isCurrentStepValid && touchedSteps.has(currentStep) && (
                      <p className="text-[10px] text-slate-600">
                        Complete the remaining required fields
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Publish gating message */}
              {currentStep === steps.length - 1 && !allStepsCompleted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[11px] text-slate-600 mt-3"
                >
                  Complete {steps.length - completedSections} more section{steps.length - completedSections !== 1 ? 's' : ''} to publish
                </motion.p>
              )}
            </div>
          </motion.main>

          {/* Right: Live Preview */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="sticky top-6">
              <LivePreview />
            </div>
          </motion.aside>
        </div>

        {/* Mobile Preview Overlay */}
        <AnimatePresence>
          {showMobilePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobilePreview(false)} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 overflow-y-auto"
              >
                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4" />
                <LivePreview />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step Celebration Overlay */}
      <AnimatePresence>
        {stepCelebration !== null && <StepCelebration step={stepCelebration} />}
      </AnimatePresence>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <CreateEventProvider>
      <CreateEventInner />
    </CreateEventProvider>
  );
}
