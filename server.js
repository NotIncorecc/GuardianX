// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Emergency keywords (for server-side verification)
const EMERGENCY_KEYWORDS = ['help', 'save me', 'please help', 'emergency', 'call police'];

app.post('/emergency', (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ message: 'Transcript is required.' });
  }

  const isEmergency = EMERGENCY_KEYWORDS
    .some(keyword => transcript.toLowerCase().includes(keyword));

  if (isEmergency) {
    console.log('🚨 Emergency Detected:', transcript);
    // TODO: integrate SMS/email/notification services here
    return res.status(200).json({ message: 'Emergency alert received.' });
  } else {
    console.log('No emergency:', transcript);
    return res.status(200).json({ message: 'No emergency keywords found.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
