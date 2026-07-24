const resumeInput = document.getElementById('resumeInput');
const startBtn = document.getElementById('startBtn');
const connectionStatus = document.getElementById('connectionStatus');

resumeInput.addEventListener('input', () => {
  startBtn.disabled = resumeInput.value.trim().length < 100;
});

async function checkBackendConnection() {
  try {
    const res = await fetch('http://localhost:3000/api/test');
    const data = await res.json();
    connectionStatus.textContent = `Backend connected: "${data.reply}"`;
  } catch (err) {
    connectionStatus.textContent = 'Could not reach backend. Is server.js running?';
  }
}

checkBackendConnection();