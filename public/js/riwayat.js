const filterEl = document.getElementById('filter-jenis');
const loadingEl = document.getElementById('loading');
const kosongEl = document.getElementById('kosong');
const errorEl = document.getElementById('alert-error');
const daftarEl = document.getElementById('daftar-riwayat');
const detailCard = document.getElementById('detail-card');
const detailJudul = document.getElementById('detail-judul');
const detailIsi = document.getElementById('detail-isi');

let idDetailAktif = null;

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

function buatTombol(teks, className, onClick) {
  const btn = buatElemen('button', className, teks);
  btn.type = 'button';
  btn.addEventListener('click', onClick);
  return btn;
}

// Fungsi bantu: panggil API dan lempar error berisi pesan dari server jika gagal
async function panggilApi(url, opsi) {
  const res = await fetch(url, opsi);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Terjadi kesalahan.');
  }
  return json;
}

function tutupDetail() {
  idDetailAktif = null;
  detailCard.hidden = true;
  detailIsi.textContent = '';
}

function renderSoal(daftar) {
  detailIsi.textContent = '';
  daftar.forEach((s, i) => {
    const kartu = buatElemen('div', 'soal-item');
    kartu.appendChild(buatElemen('h3', '', `Soal ${i + 1}`));
    kartu.appendChild(buatElemen('p', 'soal-tanya', s.pertanyaan));

    const ul = buatElemen('ul', 'pilihan');
    ['A', 'B', 'C', 'D'].forEach((huruf) => {
      ul.appendChild(buatElemen('li', huruf === s.jawaban ? 'benar' : '', `${huruf}. ${s.pilihan[huruf]}`));
    });
    kartu.appendChild(ul);
    kartu.appendChild(buatElemen('p', 'kunci', `Kunci jawaban: ${s.jawaban}`));
    if (s.pembahasan) {
      kartu.appendChild(buatElemen('p', 'muted', `Pembahasan: ${s.pembahasan}`));
    }
    detailIsi.appendChild(kartu);
  });
}

async function lihat(id) {
  errorEl.hidden = true;
  try {
    const { data } = await panggilApi(`/api/riwayat/${id}`);
    idDetailAktif = id;
    detailJudul.textContent = `${data.jenis === 'materi' ? 'Materi' : 'Soal'}: ${data.topik}`;
    if (data.jenis === 'materi') {
      detailIsi.textContent = '';
      detailIsi.appendChild(buatElemen('pre', 'materi-teks', data.isi));
    } else {
      renderSoal(data.isi);
    }
    detailCard.hidden = false;
    detailCard.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  }
}

async function hapus(id, topik) {
  if (!confirm(`Hapus "${topik}" dari riwayat? Tindakan ini tidak bisa dibatalkan.`)) return;
  errorEl.hidden = true;
  try {
    await panggilApi(`/api/riwayat/${id}`, { method: 'DELETE' });
    if (idDetailAktif === id) tutupDetail();
    await muat();
  } catch (err) {
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  }
}

async function ubahKuis(id, nilaiBaru) {
  errorEl.hidden = true;
  try {
    await panggilApi(`/api/riwayat/${id}/kuis`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ untukKuis: nilaiBaru }),
    });
    await muat();
  } catch (err) {
    tampilkanError(err.message || 'Tidak dapat terhubung ke server.');
  }
}

function renderDaftar(items) {
  daftarEl.textContent = '';
  kosongEl.hidden = items.length > 0;

  items.forEach((it) => {
    const baris = buatElemen('div', 'riwayat-item');

    const info = buatElemen('div', 'riwayat-info');
    const judul = buatElemen('div', 'riwayat-judul');
    judul.appendChild(buatElemen('span', `badge badge-${it.jenis}`, it.jenis === 'materi' ? 'Materi' : 'Soal'));
    judul.appendChild(buatElemen('strong', '', ` ${it.topik} `));
    if (it.untukKuis) judul.appendChild(buatElemen('span', 'badge badge-kuis', 'Kuis aktif'));
    info.appendChild(judul);
    info.appendChild(buatElemen('div', 'muted', new Date(it.dibuatPada).toLocaleString('id-ID')));
    baris.appendChild(info);

    const aksi = buatElemen('div', 'riwayat-aksi');
    aksi.appendChild(buatTombol('Lihat', 'btn btn-sekunder', () => lihat(it.id)));
    if (it.jenis === 'soal') {
      aksi.appendChild(
        buatTombol(
          it.untukKuis ? 'Batalkan Kuis' : 'Jadikan Kuis',
          it.untukKuis ? 'btn btn-sekunder' : 'btn',
          () => ubahKuis(it.id, !it.untukKuis)
        )
      );
    }
    aksi.appendChild(buatTombol('Hapus', 'btn btn-bahaya', () => hapus(it.id, it.topik)));
    baris.appendChild(aksi);

    daftarEl.appendChild(baris);
  });
}

async function muat() {
  loadingEl.hidden = false;
  try {
    const jenis = filterEl.value;
    const url = jenis ? `/api/riwayat?jenis=${jenis}` : '/api/riwayat';
    const { data } = await panggilApi(url);
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

filterEl.addEventListener('change', () => {
  tutupDetail();
  muat();
});

muat();