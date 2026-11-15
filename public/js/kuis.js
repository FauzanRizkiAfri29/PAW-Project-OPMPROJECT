const pilihCard = document.getElementById('pilih-card');
const daftarEl = document.getElementById('daftar-kuis');
const kosongEl = document.getElementById('kosong');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('alert-error');

const kerjaCard = document.getElementById('kerja-card');
const kerjaJudul = document.getElementById('kerja-judul');
const soalWadah = document.getElementById('soal-wadah');
const kirimBtn = document.getElementById('kirim-btn');
const batalBtn = document.getElementById('batal-btn');

const hasilCard = document.getElementById('hasil-card');
const skorAngka = document.getElementById('skor-angka');
const skorRingkas = document.getElementById('skor-ringkas');
const skorPesan = document.getElementById('skor-pesan');
const hasilWadah = document.getElementById('hasil-wadah');
const ulangBtn = document.getElementById('ulang-btn');
const daftarBtn = document.getElementById('daftar-btn');

const HURUF = ['A', 'B', 'C', 'D'];
let kuisAktif = null;

function tampilkanError(pesan) {
  errorEl.textContent = pesan;
  errorEl.hidden = false;
}

// Dibuat dengan textContent (bukan innerHTML) agar teks tidak dieksekusi sebagai HTML
function buatElemen(tag, className, teks) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

async function panggilApi(url, opsi) {
  const res = await fetch(url, opsi);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan.');
  }
  return json;
}

function tampilkanBagian(bagian) {
  pilihCard.hidden = bagian !== 'pilih';
  kerjaCard.hidden = bagian !== 'kerja';
  hasilCard.hidden = bagian !== 'hasil';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Daftar kuis ----------
function renderDaftar(items) {
  daftarEl.textContent = '';
  kosongEl.hidden = items.length > 0;

  items.forEach((it) => {
    const baris = buatElemen('div', 'riwayat-item');
    const info = buatElemen('div', 'riwayat-info');
    info.appendChild(buatElemen('strong', '', it.topik));
    info.appendChild(buatElemen('div', 'muted', `${it.jumlahSoal} soal`));
    baris.appendChild(info);

    const btn = buatElemen('button', 'btn', 'Mulai');
    btn.type = 'button';
    btn.addEventListener('click', () => mulai(it.id));
    baris.appendChild(btn);

    daftarEl.appendChild(baris);
  });
}

async function muatDaftar() {
  loadingEl.hidden = false;
  try {
    const { data } = await panggilApi('/api/kuis');
    errorEl.hidden = true;
    renderDaftar(data);
  } catch (err) {
    daftarEl.textContent = '';
    kosongEl.hidden = true;
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  } finally {
    loadingEl.hidden = true;
  }
}

// ---------- Mengerjakan kuis ----------
function renderKerja(kuis) {
  kerjaJudul.textContent = `Kuis: ${kuis.topik}`;
  soalWadah.textContent = '';

  kuis.soal.forEach((s, i) => {
    const kartu = buatElemen('div', 'soal-item');
    kartu.appendChild(buatElemen('h3', '', `Soal ${i + 1}`));
    kartu.appendChild(buatElemen('p', 'soal-tanya', s.pertanyaan));

    const ul = buatElemen('ul', 'pilihan');
    HURUF.forEach((huruf) => {
      const li = document.createElement('li');
      const label = buatElemen('label', 'pilihan-radio');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `soal-${i}`;
      input.value = huruf;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${huruf}. ${s.pilihan[huruf]}`));
      li.appendChild(label);
      ul.appendChild(li);
    });
    kartu.appendChild(ul);
    soalWadah.appendChild(kartu);
  });
}

async function mulai(id) {
  errorEl.hidden = true;
  try {
    const { data } = await panggilApi(`/api/kuis/${id}`);
    kuisAktif = data;
    renderKerja(data);
    kirimBtn.disabled = false;
    kirimBtn.textContent = 'Kirim Jawaban';
    tampilkanBagian('kerja');
  } catch (err) {
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  }
}

function kumpulkanJawaban() {
  return kuisAktif.soal.map((_, i) => {
    const dipilih = document.querySelector(`input[name="soal-${i}"]:checked`);
    return dipilih ? dipilih.value : null;
  });
}

// ---------- Hasil ----------
function pesanNilai(nilai) {
  if (nilai >= 80) return 'Hebat! Pertahankan semangat belajarmu.';
  if (nilai >= 60) return 'Bagus! Pelajari lagi pembahasan agar lebih paham.';
  return 'Ayo belajar lagi. Baca pembahasannya, lalu coba ulangi kuis.';
}

function renderHasil(data) {
  skorAngka.textContent = String(data.nilai);
  skorRingkas.textContent = `Benar ${data.benar} dari ${data.total} soal`;
  skorPesan.textContent = pesanNilai(data.nilai);
  hasilWadah.textContent = '';

  kuisAktif.soal.forEach((s, i) => {
    const h = data.hasil[i];
    const kartu = buatElemen('div', 'soal-item');
    kartu.appendChild(buatElemen('h3', '', `Soal ${i + 1} - ${h.benar ? 'Benar' : 'Salah'}`));
    kartu.appendChild(buatElemen('p', 'soal-tanya', s.pertanyaan));

    const ul = buatElemen('ul', 'pilihan');
    HURUF.forEach((huruf) => {
      let kelas = '';
      if (huruf === h.kunci) kelas = 'benar';
      else if (huruf === h.jawabanSiswa) kelas = 'salah';
      ul.appendChild(buatElemen('li', kelas, `${huruf}. ${s.pilihan[huruf]}`));
    });
    kartu.appendChild(ul);

    const jawabanKamu = h.jawabanSiswa ? h.jawabanSiswa : 'tidak dijawab';
    kartu.appendChild(buatElemen('p', 'kunci', `Jawabanmu: ${jawabanKamu}. Kunci: ${h.kunci}`));
    if (h.pembahasan) {
      kartu.appendChild(buatElemen('p', 'muted', `Pembahasan: ${h.pembahasan}`));
    }
    hasilWadah.appendChild(kartu);
  });
}

kirimBtn.addEventListener('click', async () => {
  errorEl.hidden = true;
  const jawaban = kumpulkanJawaban();
  const kosong = jawaban.filter((j) => j === null).length;
  if (kosong > 0) {
    tampilkanError(`Masih ada ${kosong} soal yang belum dijawab.`);
    // errorEl ada di kartu daftar, jadi tampilkan juga lewat alert agar terlihat siswa
    alert(`Masih ada ${kosong} soal yang belum dijawab.`);
    return;
  }

  kirimBtn.disabled = true;
  kirimBtn.textContent = 'Menilai...';
  try {
    const { data } = await panggilApi(`/api/kuis/${kuisAktif.id}/nilai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jawaban }),
    });
    errorEl.hidden = true;
    renderHasil(data);
    tampilkanBagian('hasil');
  } catch (err) {
    kirimBtn.disabled = false;
    kirimBtn.textContent = 'Kirim Jawaban';
    alert(err.message || 'Tidak dapat terhubung ke server.');
  }
});

batalBtn.addEventListener('click', () => {
  errorEl.hidden = true;
  tampilkanBagian('pilih');
  muatDaftar();
});

ulangBtn.addEventListener('click', () => mulai(kuisAktif.id));

daftarBtn.addEventListener('click', () => {
  errorEl.hidden = true;
  tampilkanBagian('pilih');
  muatDaftar();
});

muatDaftar();