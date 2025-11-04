const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// 🕒 Helper for clean timestamps
const log = (msg, data = null) => {
  const time = new Date().toISOString();
  console.log(`\n[${time}] ${msg}`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp Webhook server is running on Render');
  log('Root route accessed');
});

// ✅ Webhook verification (for Meta / WhatsApp)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'smsram_verify_token'; // your token

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  log('🔍 Verification request received', { mode, token, challenge });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    log('✅ Verified successfully!');
    res.status(200).send(challenge);
  } else {
    log('❌ Verification failed');
    res.sendStatus(403);
  }
});

// ✅ Receive messages (POST)
app.post('/webhook', (req, res) => {
  log('📩 Webhook message received', req.body);
  res.sendStatus(200);
});

// ✅ Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => log(`🚀 Server running on port ${PORT}`));
