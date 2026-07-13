import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useValidateTicketMutation } from '../../features/tickets/ticketsApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCodeIcon, CameraIcon, CheckCircleIcon, XCircleIcon,
  ExclamationTriangleIcon, StopIcon, ArrowPathIcon,
  UserIcon, TicketIcon, CreditCardIcon, ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const RESULT_MAP = {
  valid: { icon: CheckCircleIcon, bg: 'bg-emerald-500/15 border-emerald-500/50', iconColor: 'text-emerald-400', title: 'Access Granted', color: 'emerald' },
  already_used: { icon: XCircleIcon, bg: 'bg-red-500/15 border-red-500/50', iconColor: 'text-red-400', title: 'Already Checked In', color: 'red' },
  expired: { icon: ExclamationTriangleIcon, bg: 'bg-amber-500/15 border-amber-500/50', iconColor: 'text-amber-400', title: 'Ticket Expired', color: 'amber' },
  invalid: { icon: XCircleIcon, bg: 'bg-red-500/15 border-red-500/50', iconColor: 'text-red-400', title: 'Invalid QR Code', color: 'red' },
  unpaid: { icon: ExclamationTriangleIcon, bg: 'bg-amber-500/15 border-amber-500/50', iconColor: 'text-amber-400', title: 'Payment Pending', color: 'amber' },
  cancelled: { icon: XCircleIcon, bg: 'bg-red-500/15 border-red-500/50', iconColor: 'text-red-400', title: 'Booking Cancelled', color: 'red' },
};

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const [lastScanned, setLastScanned] = useState([]);
  const scannerRef = useRef(null);
  const readerRef = useRef(null);
  const [validateTicket] = useValidateTicketMutation();

  const handleValidation = useCallback(async (token) => {
    if (!token || !token.trim()) return;
    setValidating(true);
    setResult(null);
    setAttendeeInfo(null);
    try {
      const res = await validateTicket({ token: token.trim() }).unwrap();
      const data = res?.data || res;
      const status = data?.status || 'invalid';
      setResult(status);
      if (data?.ticket) setAttendeeInfo(data.ticket);
      if (status === 'valid') {
        setLastScanned((prev) => [{ name: data?.ticket?.attendeeInfo?.name || data?.ticket?.user?.name || 'Unknown', status: 'checked_in', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
      }
    } catch (e) {
      const msg = e?.data?.message || '';
      if (msg.includes('already been used') || msg.includes('already_used')) {
        setResult('already_used');
      } else if (msg.includes('expired')) {
        setResult('expired');
      } else if (msg.includes('unpaid')) {
        setResult('unpaid');
      } else if (msg.includes('cancelled')) {
        setResult('cancelled');
      } else {
        setResult('invalid');
      }
      toast.error(msg || 'Invalid QR code');
    } finally {
      setValidating(false);
      setManualToken('');
    }
  }, [validateTicket]);

  const startCamera = useCallback(async () => {
    try {
      setScanning(true);
      setResult(null);
      setAttendeeInfo(null);
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          scanner.stop().catch(() => {});
          setScanning(false);
          handleValidation(decodedText);
        },
        () => {}
      );
    } catch {
      setScanning(false);
      toast.error('Camera access denied or unavailable');
    }
  }, [handleValidation]);

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch { /* ignore */ }
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const resultConfig = result ? RESULT_MAP[result] || RESULT_MAP.invalid : null;
  const InfoIcon = resultConfig?.icon || CheckCircleIcon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">QR Scanner</h1>
          <p className="text-zinc-400 text-sm mt-1">Scan tickets for entry and exit</p>
        </div>
        <div className="flex items-center gap-2">
          {scanning ? (
            <button onClick={stopCamera} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all border border-red-500/20">
              <StopIcon className="w-4 h-4" /> Stop Camera
            </button>
          ) : (
            <button onClick={startCamera} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-all border border-violet-500/20">
              <CameraIcon className="w-4 h-4" /> Start Camera
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Scanner */}
        <div className="space-y-4">
          <div className="glass rounded-2xl overflow-hidden">
            <div id="qr-reader" ref={readerRef} className={`w-full ${scanning ? 'min-h-[320px]' : 'min-h-[200px] flex items-center justify-center'}`}>
              {!scanning && (
                <div className="text-center p-8">
                  <QrCodeIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">Click <span className="text-violet-400 font-medium">Start Camera</span> to begin scanning</p>
                </div>
              )}
            </div>
          </div>

          {/* Manual input */}
          <div className="glass p-5 rounded-2xl">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TicketIcon className="w-4 h-4 text-violet-400" />
              Manual Token Entry
            </h3>
            <div className="flex gap-2">
              <input
                type="text" value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste ticket code or QR token..."
                className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleValidation(manualToken)}
              />
              <button onClick={() => handleValidation(manualToken)}
                disabled={!manualToken.trim() || validating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50">
                {validating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : 'Validate'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Result & Attendee Info */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {result && resultConfig ? (
              <motion.div key={result} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`rounded-2xl border p-6 ${resultConfig.bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${resultConfig.iconColor} bg-white/5`}>
                    <InfoIcon className={`w-6 h-6 ${resultConfig.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{resultConfig.title}</h2>
                    <p className="text-sm text-zinc-400">{result === 'valid' ? 'Attendee may enter' : 'Scan another ticket'}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 text-center">
                <QrCodeIcon className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-500 text-sm">Scan a ticket QR code to see attendee details</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attendee Info */}
          {attendeeInfo && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-violet-400" />
                Attendee Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Name</p>
                  <p className="text-sm font-medium text-white truncate">{attendeeInfo.attendeeInfo?.name || attendeeInfo.user?.name || '—'}</p>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-zinc-300 truncate">{attendeeInfo.attendeeInfo?.email || attendeeInfo.user?.email || '—'}</p>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-zinc-300">{attendeeInfo.attendeeInfo?.phone || attendeeInfo.user?.phone || '—'}</p>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Ticket Code</p>
                  <p className="text-sm font-mono text-violet-300 truncate">{attendeeInfo.ticketCode || '—'}</p>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Event</p>
                  <p className="text-sm text-zinc-300 truncate">{attendeeInfo.event?.title || '—'}</p>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Ticket Type</p>
                  <p className="text-sm text-zinc-300">{attendeeInfo.tierName || 'Standard'}</p>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Payment</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    attendeeInfo.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    attendeeInfo.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>{attendeeInfo.paymentStatus || '—'}</span>
                </div>
                <div className="glass-sm px-3 py-2.5 rounded-xl">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Entry Status</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    attendeeInfo.entryStatus === 'checked_in' ? 'bg-emerald-500/10 text-emerald-400' :
                    attendeeInfo.entryStatus === 'checked_out' ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-500/10 text-zinc-400'
                  }`}>{attendeeInfo.entryStatus || 'unused'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recent scans */}
          {lastScanned.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-violet-400" />
                Recent Scans
              </h3>
              <div className="space-y-1.5">
                {lastScanned.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.02]">
                    <span className="text-sm text-zinc-300">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        s.status === 'checked_in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>{s.status === 'checked_in' ? 'In' : 'Out'}</span>
                      <span className="text-[10px] text-zinc-600">{s.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        #qr-reader video { width: 100% !important; border-radius: 0 !important; object-fit: cover !important; }
        #qr-reader__dashboard_section_csr button { display: none !important; }
        #qr-reader__scan_region { background: #000 !important; }
        #qr-reader__scan_region > div { border: 0 !important; }
      `}</style>
    </motion.div>
  );
}
