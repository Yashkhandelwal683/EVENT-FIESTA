import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';

const STORAGE_KEY = 'eventfiesta_create_draft';

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveDraft(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

const STEPS = [
  { id: 0, label: 'Event Details', icon: '📋' },
  { id: 1, label: 'Participation', icon: '👥' },
  { id: 2, label: 'Tickets', icon: '🎫' },
  { id: 3, label: 'Schedule', icon: '📅' },
  { id: 4, label: 'Media', icon: '🖼️' },
  { id: 5, label: 'Review', icon: '✅' },
];

const CATEGORIES = [
  'conference', 'concert', 'festival', 'sports', 'workshop', 'networking', 'exhibition', 'other',
];

const initialFormData = {
  title: '',
  description: '',
  category: '',
  location: '',
  price: 0,
  maxParticipants: '',
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  eventType: '',
  teamSize: '',
  minTeamSize: '',
  visibility: 'public',
  poster: null,
  posterPreview: '',
  gallery: [],
  galleryPreviews: [],
  tickets: [],
  schedule: [],
  tags: [],
  totalCapacity: '',
};

function getFieldStatus(formData) {
  return [
    { step: 0, key: 'title', label: 'Event Title', completed: !!formData.title?.trim() },
    { step: 0, key: 'description', label: 'Description', completed: !!formData.description?.trim() },
    { step: 0, key: 'category', label: 'Category', completed: !!formData.category },
    { step: 0, key: 'location', label: 'Location', completed: !!formData.location?.trim() },
    { step: 1, key: 'eventType', label: 'Participation Type', completed: !!formData.eventType },
    { step: 2, key: 'tickets', label: 'Ticket Setup', completed: formData.tickets?.some(t => t.name?.trim()) },
    { step: 3, key: 'startDate', label: 'Start Date', completed: !!formData.startDate },
    { step: 4, key: 'poster', label: 'Event Poster', completed: !!formData.poster },
  ];
}

function validateStep(step, formData) {
  const errors = [];

  switch (step) {
    case 0: {
      if (!formData.title?.trim()) errors.push('Event title is required');
      if (formData.title?.trim().length > 200) errors.push('Title must be under 200 characters');
      if (!formData.description?.trim()) errors.push('Event description is required');
      if (!formData.category) errors.push('Please select a category');
      if (!formData.location?.trim()) errors.push('Location is required');
      break;
    }
    case 1: {
      if (!formData.eventType) errors.push('Select a participation type');
      if (formData.eventType === 'team') {
        if (!formData.teamSize || Number(formData.teamSize) < 2) errors.push('Team size must be at least 2');
        if (formData.minTeamSize && formData.teamSize && Number(formData.minTeamSize) > Number(formData.teamSize)) {
          errors.push('Min team size cannot exceed team size');
        }
      }
      if (formData.price < 0) errors.push('Price cannot be negative');
      break;
    }
    case 2: {
      const validTickets = formData.tickets.filter(t => t.name?.trim());
      if (validTickets.length === 0) errors.push('At least one ticket type with a name is required');
      validTickets.forEach((t, i) => {
        if (t.price < 0) errors.push(`"${t.name}" price cannot be negative`);
        if (!t.quantity || t.quantity < 1) errors.push(`"${t.name}" quantity must be at least 1`);
      });
      break;
    }
    case 3: {
      if (!formData.startDate) errors.push('Start date & time is required');
      if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        errors.push('End date must be after start date');
      }
      if (formData.registrationDeadline && formData.startDate && new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
        errors.push('Registration deadline must be before start date');
      }
      break;
    }
    case 4: {
      if (!formData.poster) errors.push('Event poster is required');
      break;
    }
    default:
      break;
  }

  return errors;
}

const CreateEventContext = createContext(null);

export function CreateEventProvider({ children }) {
  const saved = useMemo(() => loadDraft(), []);
  const [currentStep, setCurrentStep] = useState(saved?.currentStep ?? 0);
  const [completedSteps, setCompletedSteps] = useState(new Set(saved?.completedSteps ?? []));
  const [formData, setFormData] = useState(() => {
    if (!saved?.formData) return initialFormData;
    return { ...initialFormData, ...saved.formData, poster: null, posterPreview: '', gallery: [], galleryPreviews: [] };
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [touchedSteps, setTouchedSteps] = useState(new Set());
  const [blurredFields, setBlurredFields] = useState(new Set(saved?.blurredFields ?? []));
  const [lastSaved, setLastSaved] = useState(null);
  const [stepCelebration, setStepCelebration] = useState(null);

  const saveTimer = useRef(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveDraft({
        formData,
        currentStep,
        completedSteps: [...completedSteps],
        blurredFields: [...blurredFields],
      });
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [formData, currentStep, completedSteps, blurredFields]);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateTicket = useCallback((index, field, value) => {
    setFormData(prev => {
      const tickets = [...prev.tickets];
      tickets[index] = { ...tickets[index], [field]: value };
      return { ...prev, tickets };
    });
  }, []);

  const addTicket = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      tickets: [...prev.tickets, { name: '', price: 0, quantity: 50, description: '' }],
    }));
  }, []);

  const removeTicket = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));
  }, []);

  const addScheduleItem = useCallback((item) => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { ...item, id: Date.now() }],
    }));
  }, []);

  const removeScheduleItem = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter(s => s.id !== id),
    }));
  }, []);

  const markStepComplete = useCallback((step) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  }, []);

  const touchStep = useCallback((step) => {
    setTouchedSteps(prev => new Set([...prev, step]));
  }, []);

  const touchField = useCallback((fieldKey) => {
    setBlurredFields(prev => new Set([...prev, fieldKey]));
  }, []);

  const stepErrors = useMemo(() => validateStep(currentStep, formData), [currentStep, formData]);
  const isCurrentStepValid = stepErrors.length === 0;

  const goToStep = useCallback((step) => {
    if (step < 0 || step >= STEPS.length) return;
    if (step > currentStep) return;
    setCurrentStep(step);
    touchStep(step);
  }, [currentStep, touchStep]);

  const nextStep = useCallback(() => {
    if (!isCurrentStepValid) {
      touchStep(currentStep);
      return;
    }
    const prevCompleted = completedSteps.size;
    markStepComplete(currentStep);

    const fields = getFieldStatus(formData);
    const currentStepFields = fields.filter(f => f.step === currentStep);
    const allCurrentDone = currentStepFields.every(f => f.completed);

    if (allCurrentDone && prevCompleted <= currentStep) {
      setStepCelebration(currentStep);
      setTimeout(() => setStepCelebration(null), 2000);
    }

    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      touchStep(next);
    }
  }, [currentStep, markStepComplete, isCurrentStepValid, touchStep, formData, completedSteps.size]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      touchStep(prev);
    }
  }, [currentStep, touchStep]);

  const allErrors = useMemo(() => {
    const map = {};
    for (let i = 0; i < STEPS.length; i++) {
      map[i] = validateStep(i, formData);
    }
    return map;
  }, [formData]);

  const fieldStatus = useMemo(() => getFieldStatus(formData), [formData]);

  const progress = useMemo(() => {
    const total = fieldStatus.length;
    const completed = fieldStatus.filter(f => f.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [fieldStatus]);

  const getStepRemainingTasks = useCallback((step) => {
    return fieldStatus.filter(f => f.step === step && !f.completed);
  }, [fieldStatus]);

  const getStepCompletedCount = useCallback((step) => {
    return fieldStatus.filter(f => f.step === step && f.completed).length;
  }, [fieldStatus]);

  const getStepTotalRequired = useCallback((step) => {
    return fieldStatus.filter(f => f.step === step).length;
  }, [fieldStatus]);

  const allStepsCompleted = useMemo(() => {
    return fieldStatus.every(f => f.completed);
  }, [fieldStatus]);

  const getStepFieldStatus = useCallback((stepIdx) => {
    const stepFields = fieldStatus.filter(f => f.step === stepIdx);
    if (stepFields.length === 0) return 'not_started';
    const completedCount = stepFields.filter(f => f.completed).length;
    if (completedCount === stepFields.length) return 'completed';
    if (completedCount > 0) return 'in_progress';
    return 'not_started';
  }, [fieldStatus]);

  const completedSections = useMemo(() => {
    return STEPS.filter((_, idx) => getStepFieldStatus(idx) === 'completed').length;
  }, [getStepFieldStatus]);

  const value = {
    steps: STEPS,
    categories: CATEGORIES,
    currentStep,
    completedSteps,
    touchedSteps,
    blurredFields,
    formData,
    progress,
    stepErrors,
    allErrors,
    isCurrentStepValid,
    isSaving,
    isPublishing,
    lastSaved,
    stepCelebration,
    fieldStatus,
    allStepsCompleted,
    completedSections,
    getStepFieldStatus,
    updateField,
    updateTicket,
    addTicket,
    removeTicket,
    addScheduleItem,
    removeScheduleItem,
    markStepComplete,
    touchStep,
    touchField,
    goToStep,
    nextStep,
    prevStep,
    setIsSaving,
    setIsPublishing,
    setLastSaved,
    getStepRemainingTasks,
    getStepCompletedCount,
    getStepTotalRequired,
    clearDraft,
  };

  return (
    <CreateEventContext.Provider value={value}>
      {children}
    </CreateEventContext.Provider>
  );
}

export function useCreateEvent() {
  const ctx = useContext(CreateEventContext);
  if (!ctx) throw new Error('useCreateEvent must be used within CreateEventProvider');
  return ctx;
}
