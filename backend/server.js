// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    return { contacts: [] };
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read DB file, starting with empty DB', e);
    return { contacts: [] };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function seedIfEmpty() {
  const db = loadDB();
  if (!db.contacts || db.contacts.length === 0) {
    const sample = [
      { name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '+1 555-201-3301', company: 'Acme Corp', tags: ['client', 'priority'], notes: 'Met at the tech conference.' },
      { name: 'Rahul Mehta', email: 'rahul.mehta@contoso.co', phone: '+91 98765 43210', company: 'Contoso', tags: ['vendor'], notes: '' },
      { name: 'Sofia Martinez', email: 'sofia.m@globex.com', phone: '+34 600 123 456', company: 'Globex', tags: ['lead'], notes: 'Interested in annual plan.' },
      { name: 'Liam O\'Brien', email: 'liam.obrien@example.org', phone: '+353 85 123 4567', company: 'Initech', tags: ['partner'], notes: '' },
      { name: 'Chen Wei', email: 'chen.wei@initech.cn', phone: '+86 138 0013 8000', company: 'Initech China', tags: ['client'], notes: 'Prefers email communication.' },
      { name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1 555-201-1100', company: 'Acme Corp', tags: ['client', 'upsell'], notes: 'Ask about Q3 renewal.' },
      { name: 'Karthik N', email: 'karthik.n@startup.io', phone: '+91 99876 54321', company: 'Startup.io', tags: ['lead', 'beta'], notes: 'Requested demo link.' },
      { name: 'Marie Curie', email: 'marie.curie@radlabs.fr', phone: '+33 6 12 34 56 78', company: 'Rad Labs', tags: ['research'], notes: '' },
      { name: 'John Smith', email: 'john.smith@smithandco.com', phone: '+1 555-200-7788', company: 'Smith & Co', tags: ['vendor'], notes: '' },
      { name: 'Aisha Khan', email: 'aisha.khan@fabrikam.pk', phone: '+92 301 2345678', company: 'Fabrikam', tags: ['client'], notes: 'Prefers WhatsApp.' },
      { name: 'Diego Rivera', email: 'diego.rivera@arts.mx', phone: '+52 55 1234 5678', company: 'Arts MX', tags: ['partner'], notes: '' },
      { name: 'Hiro Tanaka', email: 'hiro.tanaka@nippon.co.jp', phone: '+81 90 1234 5678', company: 'Nippon Co', tags: ['lead'], notes: 'Timezone JST.' }
    ];
    db.contacts = sample.map(c => ({ id: randomUUID(), ...c }));
    saveDB(db);
    console.log('Seeded DB with sample contacts.');
  }
}

seedIfEmpty();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(payload, isUpdate = false) {
  const errors = [];
  const required = ['name', 'email', 'phone'];
  if (!isUpdate) {
    for (const f of required) {
      if (!payload[f] || String(payload[f]).trim() === '') errors.push(`${f} is required`);
    }
  }
  if (payload.email !== undefined && !emailRegex.test(String(payload.email))) {
    errors.push('email is invalid');
  }
  if (payload.phone !== undefined) {
    const digits = String(payload.phone).replace(/\D/g, '');
    if (digits.length < 7) errors.push('phone seems invalid');
  }
  if (payload.tags !== undefined && !Array.isArray(payload.tags)) {
    errors.push('tags must be an array of strings');
  }
  return errors;
}

// List + search
app.get('/api/contacts', (req, res) => {
  const db = loadDB();
  const q = (req.query.q || '').toString().trim().toLowerCase();
  let results = db.contacts;
  if (q) {
    results = results.filter(c => {
      const hay = [c.name, c.email, c.company, Array.isArray(c.tags) ? c.tags.join(' ') : '']
        .filter(Boolean)
        .join(' ') 
        .toLowerCase();
      return hay.includes(q);
    });
  }
  res.json(results);
});

// Get one
app.get('/api/contacts/:id', (req, res) => {
  const db = loadDB();
  const c = db.contacts.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json(c);
});

// Create
app.post('/api/contacts', (req, res) => {
  const payload = req.body || {};
  const errors = validateContact(payload, false);
  if (errors.length) return res.status(400).json({ errors });

  const db = loadDB();
  const contact = {
    id: randomUUID(),
    name: String(payload.name).trim(),
    email: String(payload.email).trim(),
    phone: String(payload.phone).trim(),
    company: payload.company ? String(payload.company).trim() : '',
    tags: Array.isArray(payload.tags) ? payload.tags.map(t => String(t).trim()).filter(Boolean) : [],
    notes: payload.notes ? String(payload.notes) : ''
  };
  db.contacts.push(contact);
  saveDB(db);
  res.status(201).json(contact);
});

// Update
app.put('/api/contacts/:id', (req, res) => {
  const db = loadDB();
  const idx = db.contacts.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const payload = req.body || {};
  const errors = validateContact(payload, true);
  if (errors.length) return res.status(400).json({ errors });

  const existing = db.contacts[idx];
  const updated = {
    ...existing,
    ...payload,
  };
  // Normalize fields
  if (updated.name) updated.name = String(updated.name).trim();
  if (updated.email) updated.email = String(updated.email).trim();
  if (updated.phone) updated.phone = String(updated.phone).trim();
  if (updated.company !== undefined) updated.company = String(updated.company || '').trim();
  if (updated.tags !== undefined) updated.tags = Array.isArray(updated.tags) ? updated.tags.map(t => String(t).trim()).filter(Boolean) : existing.tags;
  if (updated.notes !== undefined) updated.notes = String(updated.notes || '');

  db.contacts[idx] = updated;
  saveDB(db);
  res.json(updated);
});

// Delete
app.delete('/api/contacts/:id', (req, res) => {
  const db = loadDB();
  const before = db.contacts.length;
  db.contacts = db.contacts.filter(x => x.id !== req.params.id);
  if (db.contacts.length === before) return res.status(404).json({ message: 'Not found' });
  saveDB(db);
  res.status(204).send();
});

app.get('/', (req, res) => {
  res.send('Contact Management API is running. Use /api/contacts');
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
