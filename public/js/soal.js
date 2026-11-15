const form = document.getElementById('soal-form');
const topikEl = document.getElementById('topik');
const jumlahEl = document.getElementById('jumlah');
const buatBtn = document.getElementById('buat-btn');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('alert-error');
const hasilCard = document.getElementById('hasil-card');
const daftarEl = document.getElementById('daftar-soal');
const salinBtn = document.getElementById('salin-btn');
const salinInfo = document.getElementById('salin-info');

let soalTerakhir = [];

function setLoading(aktif) {
  buatBtn.disabled = aktif;
  loadingEl.hidden = !aktif;
}

function tampilkanError(pesan) {
  errorEl.textContent = pesan;
  errorEl.hidden = false;
}

// Dibuat dengan textContent (bukan innerHTML) agar teks dari AI tidak dieksekusi sebagai HTML
function buatElemen(tag, className, teks) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

function renderSoal(daftar) {
  daftarEl.textContent = '';

  daftar.forEach((s, i) => {
    const kartu = buatElemen('div', 'soal-item');
    kartu.appendChild(buatElemen('h3', '', `Soal ${i + 1}`));
    kartu.appendChild(buatElemen('p', 'soal-tanya', s.pertanyaan));

    const ul = buatElemen('ul', 'pilihan');
    ['A', 'B', 'C', 'D'].forEach((huruf) => {
      const li = buatElemen('li', huruf === s.jawaban ? 'benar' : '', `${huruf}. ${s.pilihan[huruf]}`);
      ul.appendChild(li);
    });
    kartu.appendChild(ul);

    kartu.appendChild(buatElemen('p', 'kunci', `Kunci jawaban: ${s.jawaban}`));
    if (s.pembahasan) {
      kartu.appendChild(buatElemen('p', 'muted', `Pembahasan: ${s.pembahasan}`));
    }
    daftarEl.appendChild(kartu);
  });
}

function soalKeTeks(daftar) {
  return daftar
    .map((s, i) => {
      const baris = [`${i + 1}. ${s.pertanyaan}`];
      ['A', 'B', 'C', 'D'].forEach((h) => baris.push(`   ${h}. ${s.pilihan[h]}`));
      baris.push(`   Kunci: ${s.jawaban}`);
      if (s.pembahasan) baris.push(`   Pembahasan: ${s.pembahasan}`);
      return baris.join('\n');
    })
    .join('\n\n');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const topik = topikEl.value.trim();
  if (!topik) return;

  errorEl.hidden = true;
  setLoading(true);

  try {
    const res = await fetch('/api/ai/soal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topik, jumlah: Number(jumlahEl.value) }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal membuat soal.');
    }

    soalTerakhir = json.data.soal;
    renderSoal(soalTerakhir);
    hasilCard.hidden = false;
    hasilCard.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    // Topik dan jumlah yang dipilih tetap ada, jadi guru bisa langsung mencoba lagi
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  } finally {
    setLoading(false);
  }
});

salinBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(soalKeTeks(soalTerakhir));
    salinInfo.textContent = 'Tersalin!';
  } catch {
    salinInfo.textContent = 'Gagal menyalin otomatis. Salin manual dari daftar soal.';
  }
  setTimeout(() => { salinInfo.textContent = ''; }, 2500);
});