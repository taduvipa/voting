const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;
const NAMAGRUP_PATH = path.join(__dirname, '../namagrup.txt');
const VOTING_PATH = path.join(__dirname, '../voting.txt');

app.use(cors());
app.use(bodyParser.json());

// Ambil daftar nama grup
app.get('/api/nama', (req, res) => {
  fs.readFile(NAMAGRUP_PATH, 'utf8', (err, data) => {
    if (err) return res.json([]);
    const list = data.split('\n').filter(x => x.trim() !== '');
    res.json(list);
  });
});

// Tambah nama grup
app.post('/api/nama', (req, res) => {
  const { nama } = req.body;
  if (!nama || !nama.trim()) {
    return res.status(400).json({ error: 'Nama tidak boleh kosong' });
  }
  fs.appendFile(NAMAGRUP_PATH, nama.trim() + '\n', err => {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan' });
    res.json({ success: true });
  });
});

// Vote untuk nama grup
app.post('/api/vote', (req, res) => {
  const { nama } = req.body;
  if (!nama || !nama.trim()) {
    return res.status(400).json({ error: 'Nama tidak boleh kosong' });
  }
  fs.appendFile(VOTING_PATH, nama.trim() + '\n', err => {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan vote' });
    res.json({ success: true });
  });
});

// Ambil hasil voting (jumlah vote per nama)
app.get('/api/vote', (req, res) => {
  fs.readFile(VOTING_PATH, 'utf8', (err, data) => {
    if (err) return res.json({});
    const lines = data.split('\n').filter(x => x.trim() !== '');
    const hasil = {};
    lines.forEach(nama => {
      hasil[nama] = (hasil[nama] || 0) + 1;
    });
    res.json(hasil);
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
