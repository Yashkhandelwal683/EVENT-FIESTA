import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGetDashboardQuery } from '../../features/organizer/organizerApi';
import { useGenerateEventQRQuery } from '../../features/qr/qrApi';
import {
  QrCodeIcon, ArrowDownTrayIcon, PrinterIcon, ShareIcon,
  CheckCircleIcon, XCircleIcon, UsersIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function QRManagement() {
  const { data } = useGetDashboardQuery();
  const counts = data?.data?.counts || {};
  const events = data?.data?.events || [];
  const [selected, setSelected] = useState(null);
  const qrImageRef = useRef(null);

  const { data: qrData, isFetching: qrLoading } = useGenerateEventQRQuery(selected, {
    skip: !selected,
  });

  const qrImage = qrData?.data?.qrImage;
  const eventUrl = qrData?.data?.eventUrl;
  const selectedEvent = events.find((e) => e._id === selected);

  const downloadQR = () => {
    if (!qrImage) return;
    const a = document.createElement('a');
    a.href = qrImage;
    a.download = `event-qr-${selectedEvent?.title?.replace(/\s+/g, '-').toLowerCase() || 'event'}.png`;
    a.click();
  };

  const printQR = () => {
    if (!qrImageRef.current) return;
    const win = window.open('');
    win.document.write(
      `<html><head><title>Print QR</title><style>body{text-align:center;padding:40px;font-family:sans-serif}</style></head><body>
        <img src="${qrImage}" style="width:400px;height:400px" />
        <p style="margin-top:20px;font-size:18px;color:#333">${selectedEvent?.title || 'Event'}</p>
        <p style="font-size:14px;color:#666">${eventUrl || ''}</p>
      </body></html>`
    );
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const shareQR = async () => {
    if (!qrImage || !navigator.share) return;
    try {
      const blob = await (await fetch(qrImage)).blob();
      const file = new File([blob], 'event-qr.png', { type: 'image/png' });
      await navigator.share({
        title: selectedEvent?.title || 'Event QR',
        text: `Scan QR to register for ${selectedEvent?.title || 'event'}`,
        url: eventUrl,
        files: [file],
      });
    } catch {}
  };

  const copyUrl = async () => {
    if (!eventUrl) return;
    try {
      await navigator.clipboard.writeText(eventUrl);
    } catch {}
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">QR Management</h1>
        <p className="text-zinc-400 text-sm mt-1">Generate, download and manage QR codes for your events</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Entries Today', value: counts.todayCheckIns || 0, icon: CheckCircleIcon, color: 'text-emerald-400' },
          { label: 'Exits Today', value: counts.todayCheckOuts || 0, icon: XCircleIcon, color: 'text-orange-400' },
          { label: 'Inside Venue', value: Math.max(0, (counts.todayCheckIns || 0) - (counts.todayCheckOuts || 0)), icon: UsersIcon, color: 'text-cyan-400' },
          { label: 'Capacity %', value: counts.totalTicketsSold ? `${Math.round(((counts.todayCheckIns || 0) / counts.totalTicketsSold) * 100)}%` : '0%', icon: QrCodeIcon, color: 'text-violet-400' },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-zinc-500">{s.label}</span>
            </div>
            <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Event QR List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {events.slice(0, 6).map((event) => (
          <motion.div
            key={event._id}
            variants={item}
            onClick={() => setSelected(event._id)}
            className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
              selected === event._id ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/[0.04] bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {event.bannerImage ? (
                  <img src={event.bannerImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <QrCodeIcon className="w-6 h-6 text-zinc-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">{event.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{event.venue?.name || event.venue?.city || '—'}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                  <span className="text-emerald-400">{event.soldCount || 0} sold</span>
                  <span className="text-violet-400">{event.checkedIn || 0} checked in</span>
                  <span className="text-orange-400">{event.checkedOut || 0} checked out</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QR Preview */}
      {selectedEvent && (
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 text-center">
          <h3 className="text-sm font-semibold text-white mb-4">QR Code — {selectedEvent.title}</h3>
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
            {qrLoading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : qrImage ? (
              <img ref={qrImageRef} src={qrImage} alt="Event QR Code" className="w-48 h-48 object-contain" />
            ) : (
              <div className="w-48 h-48 flex flex-col items-center justify-center gap-2 text-zinc-500">
                <QrCodeIcon className="w-10 h-10" />
                <span className="text-xs">Failed to generate</span>
              </div>
            )}
          </div>
          {eventUrl && (
            <button
              onClick={copyUrl}
              className="mt-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2"
              title="Click to copy"
            >
              {eventUrl}
            </button>
          )}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={downloadQR}
              disabled={!qrImage}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-all shadow-lg shadow-violet-600/20"
            >
              <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" /> Download PNG
            </button>
            <button
              onClick={printQR}
              disabled={!qrImage}
              className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-xs font-medium hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <PrinterIcon className="w-4 h-4 inline mr-1" /> Print
            </button>
            <button
              onClick={shareQR}
              disabled={!qrImage}
              className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-xs font-medium hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ShareIcon className="w-4 h-4 inline mr-1" /> Share
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
