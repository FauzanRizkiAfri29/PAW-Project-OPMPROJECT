# TanyaPAI-Ai

Asisten AI untuk pembelajaran Pendidikan Agama Islam (PAI) di SD Negeri Bagelen.
Dibuat untuk UTS/Take Home mata kuliah Pemrograman Aplikasi Web (PAW), Kelompok 1.

Guru dapat membuat ringkasan materi dan soal latihan dengan bantuan AI (Google Gemini),
memeriksanya, menyimpannya ke riwayat, lalu mengaktifkannya sebagai kuis.
Siswa dapat bertanya seputar materi PAI dan mengerjakan kuis dengan skor serta pembahasan.

## Fitur

| Fitur | Halaman | Pengguna |
|---|---|---|
| Tanya PAI (chat AI) | `/chat` | Siswa (didampingi guru) |
| Generator materi | `/guru/materi` | Guru |
| Generator soal pilihan ganda + kunci jawaban | `/guru/soal` | Guru |
| Riwayat: lihat, hapus, jadikan kuis | `/guru/riwayat` | Guru |
| Kuis interaktif dengan skor dan pembahasan | `/kuis` | Siswa |

Catatan: seluruh keluaran AI dapat keliru. Guru wajib memeriksa materi dan soal sebelum dipakai.

## Teknologi

- Node.js + Express 5
- EJS (tampilan sisi server)
- Sequelize + MySQL (`mysql2`)
- Google Gemini API (`@google/genai`)

## Prasyarat

- Node.js versi 20 atau lebih baru
- MySQL (misalnya lewat XAMPP) dan phpMyAdmin
- API key Google Gemini dari Google AI Studio

## Instalasi

```bash
git clone https://github.com/FauzanRizkiAfri29/PAW-Project-OPMPROJECT.git
cd PAW-Project-OPMPROJECT
npm install
```

### 1. Siapkan file `.env`

Salin `.env.example` menjadi `.env`, lalu isi:

```dotenv
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tanyapai_db
PORT=3000

GEMINI_API_KEY=isi_api_key_di_sini
GEMINI_MODEL=gemini-3.5-flash-lite
```

`DB_PORT` mengikuti port MySQL di komputer masing-masing (bawaan `3306`; XAMPP tertentu memakai `3307`).
File `.env` bersifat rahasia dan tidak boleh di-commit.

### 2. Buat database

1. Jalankan MySQL (XAMPP Control Panel, tombol **Start** di baris MySQL).
2. Buka phpMyAdmin, buat database kosong bernama `tanyapai_db` (collation `utf8mb4`).
3. Tabel `riwayat` dibuat otomatis saat server pertama kali dijalankan, tidak perlu dibuat manual.

### 3. Jalankan aplikasi

```bash
npm run dev     # mode pengembangan (restart otomatis)
npm start       # mode biasa
```

Buka `http://localhost:3000`. Di terminal harus muncul `Database terhubung, tabel siap`.
Jika database mati, aplikasi tetap berjalan: chat, materi, dan soal tetap berfungsi,
hanya fitur Riwayat dan Kuis yang menampilkan pesan "Database belum tersedia".

## Endpoint API

| Method | Path | Fungsi |
|---|---|---|
| POST | `/api/ai/chat` | Tanya jawab PAI |
| POST | `/api/ai/materi` | Buat ringkasan materi |
| POST | `/api/ai/soal` | Buat soal pilihan ganda |
| POST | `/api/riwayat` | Simpan materi atau soal |
| GET | `/api/riwayat` | Daftar riwayat (`?jenis=materi` atau `soal`) |
| GET | `/api/riwayat/:id` | Detail riwayat |
| DELETE | `/api/riwayat/:id` | Hapus riwayat |
| PATCH | `/api/riwayat/:id/kuis` | Aktifkan atau nonaktifkan soal sebagai kuis |
| GET | `/api/kuis` | Daftar kuis aktif |
| GET | `/api/kuis/:id` | Soal kuis (tanpa kunci jawaban) |
| POST | `/api/kuis/:id/nilai` | Kirim jawaban, terima skor dan pembahasan |

Kunci jawaban tidak pernah dikirim ke browser siswa sebelum jawaban dikirim. Penilaian dilakukan di server.

## Struktur folder

```
app.js            titik masuk aplikasi
config/           koneksi database, konfigurasi, prompt AI
controllers/      logika tiap halaman dan API
middlewares/      logger dan validasi input
models/           model Sequelize (Riwayat)
routes/           definisi route halaman dan API
services/         pemanggilan Gemini (chat, materi, soal)
views/            template EJS
public/           CSS dan JavaScript sisi klien
```

## Keselarasan dengan PRD

Seluruh fitur berada dalam In scope pada PRD Kelompok 1. Catatan implementasi:

- Fitur Riwayat dikerjakan sebelum Kuis, karena kuis dibuat dari soal yang sudah diperiksa guru
  dan perlu tempat penyimpanan.
- Tanya jawab (`/chat`) dan Kuis (`/kuis`) diimplementasikan sesuai bagian In scope PRD.


## Batasan versi ini

- Hanya mata pelajaran PAI.
- Tidak ada login: pembedaan guru dan siswa hanya lewat halaman.
- Kuis tidak menyimpan skor siswa, dan bukan penilaian akademik resmi.

## Anggota Kelompok 1

- Fisabilillhaq Daud (20230140135)
- Fauzan Rizki Afrijal (20230140129)
- Gagat Padi Yogaradhana (20230140030)
- Admaja Bahari (20230140052)
- Fathir Muhammad Kresna (20230140012)