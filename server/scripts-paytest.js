require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const BASE = 'http://localhost:5000';

(async () => {
  const login = await axios.post(`${BASE}/api/auth/login`, { email: 'khandelwalyash355@gmail.com', password: 'qwerty123' });
  const token = login.data.data.accessToken;
  const h = { Authorization: `Bearer ${token}` };

  const events = await axios.get(`${BASE}/api/events?limit=50`, { headers: h });
  const evs = events.data.data?.events || events.data.data || [];
  let picked = null, ticket = null;
  for (const e of evs) {
    if (e.status !== 'published') continue;
    if (!e.tickets || !e.tickets.length) continue;
    for (const t of e.tickets) {
      if (t.price > 0 && t.isActive !== false) { picked = e; ticket = t; break; }
    }
    if (picked) break;
  }
  if (!picked) { console.log('no paid event found'); return; }
  console.log('Event:', picked.title, '| Ticket:', ticket.name, '| Price:', ticket.price);

  const orderRes = await axios.post(`${BASE}/api/payments/create-order`, {
    eventId: picked._id,
    tickets: [{ ticketId: ticket._id, quantity: 1 }],
    attendee: { name: 'Test User', email: 'test@example.com', phone: '9876543210' },
  }, { headers: h });
  const o = orderRes.data.data;
  console.log('ORDER:', JSON.stringify({ orderId: o.orderId, amount: o.amount, currency: o.currency, keyId: o.keyId, bookingRef: o.bookingRef }));
  console.log(o.keyId.startsWith('rzp_test_') ? '✅ test key delivered to frontend (key_id only, no secret)' : '❌ unexpected key: ' + o.keyId);

  // Locally compute the HMAC exactly as the server's verifyPayment does
  const payId = 'pay_test_fake123';
  const goodSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET.trim()).update(`${o.orderId}|${payId}`).digest('hex');

  const bad = await axios.post(`${BASE}/api/payments/verify`, {
    razorpay_order_id: o.orderId, razorpay_payment_id: payId, razorpay_signature: '0'.repeat(64), bookingId: o.bookingId,
  }, { headers: h }).then(() => 'NO-ERROR(!!)').catch(e => `${e.response.status} ${e.response.data?.message || ''}`);
  console.log('BAD signature →', bad.startsWith('400') ? '✅ rejected with 400' : '❌ ' + bad);

  const good = await axios.post(`${BASE}/api/payments/verify`, {
    razorpay_order_id: o.orderId, razorpay_payment_id: payId, razorpay_signature: goodSig, bookingId: o.bookingId,
  }, { headers: h }).then(r => `${r.status} booking:${r.data.data.booking.status}`).catch(e => `ERR ${e.response?.status}: ${e.response?.data?.message||e.message}`);
  console.log('GOOD signature →', good, good.startsWith('200') ? '✅ full verify chain works' : '');

  console.log('NOTE: real test-card payment must run in browser (card 4111 1111 1111 1111 / CVV 123 / 12/26, UPI test@razorpay)');
})().catch(e => console.log('FATAL', e.response?.status, JSON.stringify(e.response?.data) || e.message));
