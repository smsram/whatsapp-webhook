const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

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

  console.log('🔍 Verification request received:', { mode, token, challenge });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification failed');
    res.sendStatus(403);
  }
});

// ✅ Receive messages (POST)
app.post('/webhook', (req, res) => {
  console.log('📩 Webhook message received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
