const form = document.getElementById('materi-form');
const topikEl = document.getElementById('topik');
const buatBtn = document.getElementById('buat-btn');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('alert-error');
const hasilCard = document.getElementById('hasil-card');
const hasilEl = document.getElementById('hasil');
const salinBtn = document.getElementById('salin-btn');
const salinInfo = document.getElementById('salin-info');

function setLoading(aktif) {
  buatBtn.disabled = aktif;
  loadingEl.hidden = !aktif;
}

function tampilkanError(pesan) {
  errorEl.textContent = pesan;
  errorEl.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const topik = topikEl.value.trim();
  if (!topik) return;

  errorEl.hidden = true;
  setLoading(true);

  try {
    const res = await fetch('/api/ai/materi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topik }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Gagal membuat materi.');
    }

    hasilEl.value = json.data.materi;
    hasilCard.hidden = false;
    hasilCard.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    // Topik yang sudah diketik tetap ada, jadi guru bisa langsung mencoba lagi
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  } finally {
    setLoading(false);
  }
});

salinBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(hasilEl.value);
    salinInfo.textContent = 'Tersalin!';
  } catch {
    hasilEl.select();
    salinInfo.textContent = 'Teks dipilih, tekan Ctrl+C untuk menyalin.';
  }
  setTimeout(() => { salinInfo.textContent = ''; }, 2500);
});