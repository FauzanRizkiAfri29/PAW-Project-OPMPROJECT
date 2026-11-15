const form = document.getElementById('chat-form');
const input = document.getElementById('message');
const contextEl = document.getElementById('context');
const sendBtn = document.getElementById('send-btn');
const box = document.getElementById('chat-box');

function addMessage(text, className) {
  const div = document.createElement('div');
  div.className = 'msg ' + className;
  div.textContent = text; // textContent: aman dari injeksi HTML
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  input.disabled = isLoading;
  sendBtn.textContent = isLoading ? 'Mengirim...' : 'Kirim';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  const context = contextEl.value.trim();
  const payload = context ? { message, context } : { message };

  addMessage(message, 'user');
  input.value = '';
  setLoading(true);
  const typing = addMessage('TanyaPAI sedang mengetik...', 'bot typing');

  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    typing.remove();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Terjadi kesalahan.');
    }
    addMessage(json.data.reply, 'bot');
  } catch (err) {
    typing.remove();
    const pesan = err instanceof TypeError
      ? 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.'
      : err.message;
    addMessage(pesan, 'bot error');
  } finally {
    setLoading(false);
    input.focus();
  }
});