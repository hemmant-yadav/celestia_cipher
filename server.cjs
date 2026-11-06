/**
 * Arduino Uno + SIM800L Multi-Device Serial Bridge
 *
 * Runs on the laptop connected to the Arduino Uno.
 * Allows phones and laptops on the same Wi-Fi to:
 * 1. Share the single Arduino serial connection on COM9.
 * 2. Sync emergency state & live SIM800L progress across all screens in real time.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  portName: 'COM9',       // Target Arduino COM port
  baudRate: 9600,         // 8N1, 9600 baud
  bootTimeoutMs: 25000,   // 25 seconds waiting for 'READY'
  serverPort: 3001,       // Local bridge port
};

const http = require('http');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// ============================================================================
// ADMIN PANEL HTML (served at GET /admin — mobile-friendly control panel)
// ============================================================================
const ADMIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <title>Admin Panel — SafeAlert</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --red: #C83F4B; --green: #2C8C5A; --gray: #6B7280;
      --bg: #F9F1F2; --surface: #FFFFFF; --border: #EDD8DC;
      --text: #2D1B1E; --muted: #8C6B72;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg); min-height: 100dvh;
      display: flex; flex-direction: column; align-items: center;
      padding: 24px 16px 40px;
      color: var(--text);
    }
    h1 { font-size: 20px; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 4px; }
    .subtitle { font-size: 12px; color: var(--muted); margin-bottom: 24px; }
    .status-card {
      width: 100%; max-width: 440px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 16px 20px; margin-bottom: 20px;
    }
    .status-label { font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--muted); margin-bottom: 6px; }
    #status-dot {
      display: inline-block; width: 10px; height: 10px;
      border-radius: 50%; background: var(--gray);
      margin-right: 8px; vertical-align: middle;
      transition: background 0.3s;
    }
    #status-text { font-size: 15px; font-weight: 600; }
    #raw-line { font-size: 11px; color: var(--muted); margin-top: 6px; font-family: monospace; word-break: break-all; }
    .buttons { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 14px; }
    button.action {
      width: 100%; padding: 20px 16px; border: none; border-radius: 16px;
      font-size: 18px; font-weight: 800; letter-spacing: 0.03em;
      cursor: pointer; transition: transform 0.1s, opacity 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    button.action:active { transform: scale(0.97); }
    button.action:disabled { opacity: 0.35; cursor: not-allowed; }
    #btn-sos { background: var(--red); color: #fff; }
    #btn-cancel { background: #FFF0F1; color: var(--red); border: 1.5px solid var(--border); font-size: 16px; padding: 16px; }
    #btn-ready { background: #E8F4EE; color: var(--green); border: 1.5px solid #C4E0D0; font-size: 16px; padding: 16px; }
    .footer { margin-top: 32px; font-size: 11px; color: var(--muted); text-align: center; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    .pulsing { animation: pulse 1.2s ease-in-out infinite; }
  </style>
</head>
<body>
  <h1>🛡 SafeAlert Admin</h1>
  <p class="subtitle">Control panel — changes affect all connected devices</p>

  <div class="status-card">
    <div class="status-label">Arduino Status</div>
    <div>
      <span id="status-dot"></span>
      <span id="status-text">Connecting...</span>
    </div>
    <div id="raw-line"></div>
  </div>

  <div class="buttons">
    <button class="action" id="btn-sos" disabled>
      🚨 TRIGGER SOS
    </button>
    <button class="action" id="btn-cancel">
      ✕ Cancel Emergency
    </button>
    <button class="action" id="btn-ready">
      ✓ Mark Device Ready
    </button>
  </div>

  <div class="footer">
    Admin panel · port 3001 · all actions sync to all devices
  </div>

  <script>
    const dot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const rawLine = document.getElementById('raw-line');
    const btnSos = document.getElementById('btn-sos');
    const btnCancel = document.getElementById('btn-cancel');
    const btnReady = document.getElementById('btn-ready');

    function applyState(state) {
      // Update status dot colour
      if (state.error) {
        dot.style.background = '#C83F4B';
        dot.classList.remove('pulsing');
      } else if (state.isEmergencyActive) {
        dot.style.background = '#C83F4B';
        dot.classList.add('pulsing');
      } else if (state.isReady) {
        dot.style.background = '#2C8C5A';
        dot.classList.remove('pulsing');
      } else {
        dot.style.background = '#F59E0B';
        dot.classList.add('pulsing');
      }

      statusText.textContent = state.displayMessage || 'Unknown';
      rawLine.textContent = state.rawStatusLine ? ('↳ ' + state.rawStatusLine) : '';

      // SOS only enabled when ready AND not already active
      btnSos.disabled = !state.isReady || state.isEmergencyActive;
    }

    async function post(endpoint) {
      try {
        const r = await fetch(endpoint, { method: 'POST' });
        if (!r.ok) throw new Error(await r.text());
      } catch (e) {
        alert('Request failed: ' + e.message);
      }
    }

    btnSos.addEventListener('click', () => post('/api/sos'));
    btnCancel.addEventListener('click', () => post('/api/cancel'));
    btnReady.addEventListener('click', () => post('/api/mark-ready'));

    // SSE: live sync from server
    const es = new EventSource('/api/events');
    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'sync') applyState(msg.state);
      } catch {}
    };
    es.onerror = () => {
      statusText.textContent = 'Bridge disconnected — reload page';
      dot.style.background = '#C83F4B';
    };

    // Initial state fetch
    fetch('/api/state')
      .then(r => r.json())
      .then(applyState)
      .catch(() => {});
  </script>
</body>
</html>
`;

let port = null;
let parser = null;
let bootTimeoutTimer = null;
let sseClients = [];

// Shared system state synced to all connected devices (phone + laptop)
let sharedState = {
  isReady: false,
  isEmergencyActive: false,
  rawStatusLine: '',
  displayMessage: 'Connecting to Arduino on ' + CONFIG.portName + '...',
  portLabel: CONFIG.portName,
  error: null,
};

const STATUS_LABELS = {
  'READY': 'Device ready',
  'STATUS:SOS_RECEIVED': 'SOS triggered, initiating emergency sequence...',
  'STATUS:SMS_SENT': 'Emergency SMS sent to favorite contacts and nearby police. Waiting 30s for reply...',
  'STATUS:REPLIED': 'Contact replied! Emergency flow standing down.',
  'STATUS:CALLING': 'No reply within 30s. Calling emergency contact...',
  'STATUS:CALL_ENDED': 'Emergency call ended.',
  'STATUS:DONE': 'Emergency sequence complete. Ready for next alert.',
};

let simTimeout1 = null;
let simTimeout2 = null;
let simTimeout3 = null;
function clearSimTimers() {
  if (simTimeout1) clearTimeout(simTimeout1);
  if (simTimeout2) clearTimeout(simTimeout2);
  if (simTimeout3) clearTimeout(simTimeout3);
}

function broadcastState() {
  const payload = `data: ${JSON.stringify({ type: 'sync', state: sharedState })}\n\n`;
  sseClients.forEach((res) => {
    try {
      res.write(payload);
    } catch {
      // client dropped
    }
  });
}

function openPort(targetPort = CONFIG.portName) {
  if (port && port.isOpen) {
    console.log(`[SERIAL] Port ${targetPort} is already open.`);
    return;
  }

  console.log(`[SERIAL] Opening ${targetPort} at ${CONFIG.baudRate} baud...`);
  sharedState.portLabel = targetPort;
  sharedState.isReady = false;
  sharedState.error = null;
  sharedState.displayMessage = `Connecting to ${targetPort}... (waiting for READY)`;
  broadcastState();

  try {
    port = new SerialPort(
      {
        path: targetPort,
        baudRate: CONFIG.baudRate,
        autoOpen: true,
      },
      (err) => {
        if (err) {
          let msg = err.message;
          if (msg.includes('Access is denied') || msg.includes('busy')) {
            msg = `Port ${targetPort} is busy! Please close Arduino IDE Serial Monitor.`;
          }
          console.error('[SERIAL ERROR]', msg);
          sharedState.error = msg;
          sharedState.displayMessage = msg;
          broadcastState();
        } else {
          console.log(`[SERIAL] Port ${targetPort} opened successfully.`);

          // Pulse DTR to reset Uno
          try {
            port.set({ dtr: false, rts: false }, () => {
              setTimeout(() => {
                port.set({ dtr: true, rts: true }, () => {
                  console.log('[SERIAL] DTR auto-reset pulse triggered.');
                });
              }, 250);
            });
          } catch (e) {
            console.warn('[SERIAL] DTR pulse error:', e.message);
          }
        }
      }
    );

    parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    if (bootTimeoutTimer) clearTimeout(bootTimeoutTimer);
    bootTimeoutTimer = setTimeout(() => {
      if (!sharedState.isReady) {
        console.warn('[SERIAL TIMEOUT] No READY received within 25 seconds.');
        sharedState.error = 'No READY within 25s. (If board is already running, click Mark Ready)';
        sharedState.displayMessage = sharedState.error;
        broadcastState();
      }
    }, CONFIG.bootTimeoutMs);

    parser.on('data', (raw) => {
      const line = raw.toString().trim();
      if (!line) return;
      console.log('[SERIAL RX]', line);

      sharedState.rawStatusLine = line;

      if (line === 'READY') {
        if (bootTimeoutTimer) clearTimeout(bootTimeoutTimer);
        sharedState.isReady = true;
        sharedState.isEmergencyActive = false;
        sharedState.error = null;
        sharedState.displayMessage = STATUS_LABELS['READY'];
      } else if (STATUS_LABELS[line]) {
        sharedState.displayMessage = STATUS_LABELS[line];
      }

      if (line === 'STATUS:SOS_RECEIVED') {
        sharedState.isEmergencyActive = true;
      } else if (line === 'STATUS:DONE') {
        sharedState.isEmergencyActive = false;
        sharedState.isReady = true;
        sharedState.displayMessage = STATUS_LABELS['STATUS:DONE'];
      }

      broadcastState();
    });

    port.on('close', () => {
      console.warn('[SERIAL] Port closed / disconnected.');
      sharedState.isReady = false;
      sharedState.error = 'Arduino disconnected. Check USB cable.';
      sharedState.displayMessage = sharedState.error;
      broadcastState();
    });

    port.on('error', (err) => {
      console.error('[SERIAL ERROR EVENT]', err.message);
    });

  } catch (err) {
    sharedState.error = err.message;
    broadcastState();
  }
}

// HTTP Server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Get current shared state
  if (req.url === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sharedState));
    return;
  }

  // 2. Real-time SSE sync stream for all connected devices
  if (req.url === '/api/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    sseClients.push(res);

    // Send current state immediately upon connecting
    res.write(`data: ${JSON.stringify({ type: 'sync', state: sharedState })}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
    return;
  }

  // 3. Trigger SOS from ANY device (phone or laptop)
  if (req.url === '/api/sos' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      let lat = '12.8867';
      let lng = '77.4503';
      let phone = '+918197149231';
      let phone2 = '';

      try {
        if (body) {
          const parsed = JSON.parse(body);
          if (parsed.lat && parsed.lng) {
            lat = String(parsed.lat);
            lng = String(parsed.lng);
          }
          if (parsed.phone) {
            phone = String(parsed.phone).trim();
          }
          if (parsed.phone2) {
            phone2 = String(parsed.phone2).trim();
          }
        }
      } catch (_err) {}

      if (!port || !port.isOpen) {
        // If port isn't open yet, try opening
        openPort(CONFIG.portName);
      }

      clearSimTimers();
      // Format: SOS:phone:lat,lng or SOS:phone:lat,lng:phone2
      const sosCommand = phone2 
        ? `SOS:${phone}:${lat},${lng}:${phone2}\n` 
        : `SOS:${phone}:${lat},${lng}\n`;

      console.log(`[SERIAL TX] ${sosCommand.trim()} (Recipient: ${phone}${phone2 ? ', ' + phone2 : ''} | GPS: ${lat}, ${lng})`);
      sharedState.isEmergencyActive = true;
      sharedState.rawStatusLine = 'STATUS:SOS_RECEIVED';
      sharedState.displayMessage = STATUS_LABELS['STATUS:SOS_RECEIVED'];
      broadcastState();

      if (port && port.isOpen) {
        port.write(sosCommand, (err) => {
          if (err) {
            console.error('[SERIAL TX ERROR]', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, phone, phone2, lat, lng }));
          }
        });
      } else {
        // Real-time SIM800L timeline progression for simulation / testing
        simTimeout1 = setTimeout(() => {
          sharedState.rawStatusLine = 'STATUS:SMS_SENT';
          sharedState.displayMessage = STATUS_LABELS['STATUS:SMS_SENT'];
          broadcastState();

          simTimeout2 = setTimeout(() => {
            sharedState.rawStatusLine = 'STATUS:CALLING';
            sharedState.displayMessage = STATUS_LABELS['STATUS:CALLING'];
            broadcastState();

            simTimeout3 = setTimeout(() => {
              sharedState.rawStatusLine = 'STATUS:CALL_ENDED';
              sharedState.displayMessage = STATUS_LABELS['STATUS:CALL_ENDED'];
              broadcastState();
            }, 15000);
          }, 30000);
        }, 1500);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, simulated: true, lat, lng }));
      }
    });
    return;
  }

  // 4. Cancel emergency from ANY device
  if (req.url === '/api/cancel' && req.method === 'POST') {
    clearSimTimers();
    sharedState.isEmergencyActive = false;
    sharedState.rawStatusLine = '';
    sharedState.displayMessage = sharedState.isReady ? STATUS_LABELS['READY'] : 'Device ready';
    broadcastState();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 5. Mark ready bypass
  if (req.url === '/api/mark-ready' && req.method === 'POST') {
    if (bootTimeoutTimer) clearTimeout(bootTimeoutTimer);
    sharedState.isReady = true;
    sharedState.isEmergencyActive = false;
    sharedState.error = null;
    sharedState.displayMessage = STATUS_LABELS['READY'];
    broadcastState();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 6. Connect / Reconnect port
  if (req.url === '/api/connect' && req.method === 'POST') {
    openPort(CONFIG.portName);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 7. Admin control panel (mobile-friendly, no React needed)
  if (req.url === '/admin' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(ADMIN_HTML);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// Listen on 0.0.0.0 so phone can connect over Wi-Fi
server.listen(CONFIG.serverPort, '0.0.0.0', () => {
  console.log(`\n===============================================================`);
  console.log(`Arduino Multi-Device Bridge running on http://0.0.0.0:${CONFIG.serverPort}`);
  console.log(`Serial Target: ${CONFIG.portName} (baud 9600)`);
  console.log(`===============================================================\n`);
  openPort(CONFIG.portName);
});
