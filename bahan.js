const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 9000;

// Middleware
app.use(bodyParser.json());

// Load Bahan Data
let bahanData = require('./bahan.json');

// Route dasar untuk cek API
app.get('/', (req, res) => {
    res.send('Welcome to the Scan Bahan API!');
});

// Mendapatkan semua bahan
app.get('/api/bahan', (req, res) => {
    res.json(bahanData);
});

// Mendapatkan bahan berdasarkan ID
app.get('/api/bahan/:id', (req, res) => {
    const bahan = bahanData.find(b => b.id === parseInt(req.params.id));
    if (!bahan) return res.status(404).json({ message: 'Bahan not found' });
    res.json(bahan);
});

// Menambahkan bahan baru
app.post('/api/bahan', (req, res) => {
    const { nama, jenis, deskripsi } = req.body;
    const newBahan = {
        id: bahanData.length + 1,
        nama,
        jenis,
        deskripsi
    };
    bahanData.push(newBahan);

    // Simpan ke file JSON
    fs.writeFileSync('./bahan.json', JSON.stringify(bahanData, null, 2));
    res.status(201).json(newBahan);
});

// Menghapus bahan berdasarkan ID
app.delete('/api/bahan/:id', (req, res) => {
    const bahanIndex = bahanData.findIndex(b => b.id === parseInt(req.params.id));
    if (bahanIndex === -1) return res.status(404).json({ message: 'Bahan not found' });

    const deletedBahan = bahanData.splice(bahanIndex, 1);
    fs.writeFileSync('./bahan.json', JSON.stringify(bahanData, null, 2));
    res.json(deletedBahan);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
