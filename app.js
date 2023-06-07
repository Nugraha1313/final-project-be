require('dotenv').config(); // Mengimpor dotenv
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Middleware untuk memeriksa setiap permintaan
app.use((req, res, next) => {
  console.log('Middleware dijalankan');
  // Lakukan tindakan yang diperlukan di sini
  next(); // Lanjutkan ke middleware atau endpoint berikutnya
});

// Endpoint dan implementasinya
app.post('', (req, res) => {
  // Implementasi pemesanan tiket pesawat
  res.send('Pemesanan tiket berhasil');
});

// Server
const port = process.env.PORT || 3000; // Mengambil port dari variabel lingkungan atau menggunakan default 3000
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
