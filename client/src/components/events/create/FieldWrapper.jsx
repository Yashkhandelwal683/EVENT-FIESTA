import { motion, AnimatePresence } from 'framer-motion';
import { useCreateEvent } from './CreateEventContext';
import { Check } from 'lucide-react';

export default function FieldWrapper({ fieldKey, label, required, children }) {
  const { blurredFields, touchField, formData } = useCreateEvent();

  const isBlurred = blurredFields.has(fieldKey);
  const hasValue = getFieldValue(formData, fieldKey);

  const showSuccess = isBlurred && hasValue;
  const showWarning = isBlurred && !hasValue && required;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </label>
        {required && <span className="text-violet-400 text-xs">*</span>}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div
        onBlur={() => touchField(fieldKey)}
        className="relative"
      >
        {children}
        <AnimatePresence>
          {showWarning && (
            <motion.p
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="text-[11px] text-amber-400/60 mt-1.5 flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full bg-amber-400/60" />
              This field is required
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getFieldValue(formData, key) {
  const val = formData[key];
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  if (typeof val === 'number') return true;
  if (Array.isArray(val)) return val.length > 0;
  if (val instanceof File) return true;
  return !!val;
}
