require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const BASE = 'http://localhost:5000';

(async () => {
  const login = await axios.post(`${BASE}/api/auth/login`, { email: 'khandelwalyash355@gmail.com', password: 'qwerty123' });
  const token = login.data.data.accessToken;
  const headers = { Authorization: `Bearer ${token}` };

  const fd = new FormData();
  fd.append('title', 'Pub Test ' + Date.now());
  fd.append('description', 'A proper event description with enough text for validation.');
  fd.append('category', 'concert');
  fd.append('location', 'Mumbai');
  fd.append('price', '500');
  fd.append('eventType', 'solo');
  fd.append('visibility', 'public');
  fd.append('startDate', new Date(Date.now() + 3600000).toISOString());
  fd.append('endDate', new Date(Date.now() + 86400000).toISOString());
  fd.append('status', 'published');
  fd.append('tickets', JSON.stringify([{ name: 'General', price: 500, quantity: 50 }]));
  fd.append('bannerImage', fs.createReadStream('/tmp/test.png'), { filename: 'test.png', contentType: 'image/png' });

  try {
    const res = await axios.post(`${BASE}/api/events`, fd, { headers: { ...headers, ...fd.getHeaders() }, timeout: 20000 });
    console.log('✅ publish succeeded:', res.data.data._id || res.data.data.id);
  } catch (err) {
    console.log('❌ publish failed:', err.response?.status, JSON.stringify(err.response?.data) || err.message);
  }
})();
