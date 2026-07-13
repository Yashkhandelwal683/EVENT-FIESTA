import { useState, useCallback } from 'react';
import { useScanTicketMutation, useConfirmEntryMutation } from '../../features/qr/qrApi';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCodeIcon, XMarkIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function QRScannerPage() {
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanTicket] = useScanTicketMutation();
  const [confirmEntry] = useConfirmEntryMutation();

  const handleScan = useCallback(async () => {
    if (!qrInput.trim()) return;
    setScanning(true);
    try {
      const result = await scanTicket({ qrToken: qrInput.trim() }).unwrap();
      setScanResult(result.data);
    } catch (err) {
      setScanResult({
        status: 'invalid',
        message: err?.data?.message || 'Invalid QR code',
        canEnter: false,
        canExit: false,
      });
    }
    setScanning(false);
  }, [qrInput, scanTicket]);

  const handleConfirmEntry = async () => {
    if (!scanResult?.ticket?._id) return;
    try {
      const result = await confirmEntry({ ticketId: scanResult.ticket._id }).unwrap();
      toast.success(result.data?.message || 'Entry confirmed');
      setScanResult((prev) => ({
        ...prev,
        ticket: { ...prev.ticket, entryStatus: result.data.entryStatus, entryTime: result.data.entryTime, exitTime: result.data.exitTime },
        message: result.data.message,
        canEnter: result.data.entryStatus === 'checked_in' ? false : prev.canEnter,
        canExit: result.data.entryStatus === 'checked_in' ? true : false,
      }));
    } catch {
      toast.error('Failed to confirm entry');
    }
  };

  const handleClear = () => {
    setQrInput('');
    setScanResult(null);
  };

  const isSuccess = scanResult?.status === 'valid' || scanResult?.ticket?.entryStatus === 'checked_in' || scanResult?.ticket?.entryStatus === 'checked_out';
  const isWarning = scanResult?.status === 'already_checked_in';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">QR Scanner</h1>
        <p className="text-slate-400 text-sm mt-1">Scan attendee ticket QR codes to verify entry</p>
      </div>

      {/* Scanner Input */}
      <div className="glass p-6 border-surface-border/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center">
            <QrCodeIcon className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white text-sm">Enter QR Token</h2>
            <p className="text-xs text-slate-500">Paste QR code token or scan with QR scanner device</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste QR token here..."
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            className="flex-1 bg-surface-input border border-surface-border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 font-mono"
          />
          <button
            onClick={handleScan}
            disabled={scanning || !qrInput.trim()}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-glow-sm hover:shadow-glow flex items-center gap-2"
          >
            {scanning ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <QrCodeIcon className="w-4 h-4" />}
            Scan
          </button>
        </div>
      </div>

      {/* Scan Result */}
      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`glass p-6 border-2 ${
              isSuccess ? 'border-emerald-500/40' :
              isWarning ? 'border-amber-500/40' :
              'border-red-500/40'
            }`}
          >
            {/* Status Header */}
            <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl ${
              isSuccess ? 'bg-emerald-500/10' :
              isWarning ? 'bg-amber-500/10' :
              'bg-red-500/10'
            }`}>
              {isSuccess ? (
                <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
              ) : (
                <XCircleIcon className="w-8 h-8 text-red-400" />
              )}
              <div>
                <h3 className={`font-display font-semibold text-lg ${
                  isSuccess ? 'text-emerald-300' : isWarning ? 'text-amber-300' : 'text-red-300'
                }`}>
                  {isSuccess ? 'VALID TICKET' : isWarning ? 'ALREADY CHECKED IN' : 'INVALID QR'}
                </h3>
                <p className="text-sm text-slate-400">{scanResult.message}</p>
              </div>
              <button onClick={handleClear} className="ml-auto p-1.5 rounded-lg hover:bg-white/5 text-slate-400">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Attendee Info */}
            {scanResult.attendee && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white">
                      {(scanResult.attendee.name || '?')[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{scanResult.attendee.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{scanResult.attendee.email || ''}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <p>📞 {scanResult.attendee.phone || 'N/A'}</p>
                    <p>📍 {scanResult.attendee.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                    <span className="text-slate-400">Event</span>
                    <span className="text-white font-medium">{scanResult.event?.title || 'N/A'}</span>
                  </div>
                  {scanResult.subEvent && (
                    <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                      <span className="text-slate-400">Sub Event</span>
                      <span className="text-white font-medium">{scanResult.subEvent.title}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                    <span className="text-slate-400">Ticket Type</span>
                    <span className="text-white font-medium">{scanResult.ticket?.tierName || 'General'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                    <span className="text-slate-400">Ticket ID</span>
                    <span className="text-white font-mono text-xs">{scanResult.ticket?.ticketCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                    <span className="text-slate-400">Booking Ref</span>
                    <span className="text-white font-mono text-xs">{scanResult.booking?.bookingRef || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-surface-border/40">
                    <span className="text-slate-400">Amount Paid</span>
                    <span className="text-primary-300 font-bold">₹{scanResult.booking?.totalAmount || 0}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Entry Status</span>
                    <span className={`font-semibold ${
                      scanResult.ticket?.entryStatus === 'checked_in' ? 'text-emerald-400' :
                      scanResult.ticket?.entryStatus === 'checked_out' ? 'text-violet-400' :
                      scanResult.ticket?.entryStatus === 'unused' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {scanResult.ticket?.entryStatus || 'unknown'}
                    </span>
                  </div>
                  {scanResult.ticket?.entryTime && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Entry Time</span>
                      <span className="text-white text-xs">{new Date(scanResult.ticket.entryTime).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {scanResult.ticket?.exitTime && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Exit Time</span>
                      <span className="text-white text-xs">{new Date(scanResult.ticket.exitTime).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {scanResult.canEnter && (
                <button
                  onClick={handleConfirmEntry}
                  className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" /> ALLOW ENTRY
                </button>
              )}
              {scanResult.canExit && (
                <button
                  onClick={handleConfirmEntry}
                  className="flex-1 py-3 px-6 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ArrowPathIcon className="w-5 h-5" /> RECORD EXIT
                </button>
              )}
              <button
                onClick={handleClear}
                className="py-3 px-6 bg-surface-card border border-surface-border hover:border-primary-500/40 text-slate-300 font-semibold text-sm rounded-xl transition-all"
              >
                Scan Next
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!scanResult && (
        <div className="glass p-12 text-center border-dashed border-2 border-surface-border">
          <QrCodeIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-white text-lg mb-2">Ready to Scan</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Enter a QR token above to verify an attendee's ticket and manage entry/exit.
          </p>
        </div>
      )}
    </div>
  );
}
