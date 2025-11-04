const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Log file path (same folder)
const LOG_FILE = path.join(__dirname, 'server_logs.txt');

// Helper function to append logs
function logToFile(label, data) {
  const timestamp = new Date().toISOString();
  const logEntry = `\n[${timestamp}] ${label}:\n${data}\n----------------------\n`;
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
}

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Webhook server is running on Render');
});

// ✅ Webhook verification (for Meta / WhatsApp)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'smsram_verify_token'; // Change if needed

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const logData = JSON.stringify({ mode, token, challenge }, null, 2);
  logToFile('🔍 Verification request received', logData);

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    logToFile('✅ Verification success', challenge);
    res.status(200).send(challenge);
  } else {
    logToFile('❌ Verification failed', 'Token mismatch or invalid mode');
    res.sendStatus(403);
  }
});

// ✅ Receive messages (POST)
app.post('/webhook', (req, res) => {
  const requestBody = JSON.stringify(req.body, null, 2);
  logToFile('📩 Webhook message received', requestBody);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
