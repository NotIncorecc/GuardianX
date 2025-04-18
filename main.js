// main.js

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Speech Recognition API not supported in this browser. Try Chrome or Edge.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';

  // Emergency keywords (Keep this consistent with the server or fetch from it)
  const EMERGENCY_KEYWORDS = ['help', 'save me', 'please help', 'emergency', 'call police','ghost clan'];

  // UI elements
  const sosButton = document.getElementById('sos-button');
  const statusText = document.getElementById('status-text');
  const debugLog = document.getElementById('debug-log'); // Get the debug log element
  let isListening = false;

  function logMessage(message) {
    console.log(message);
    debugLog.textContent += message + '\n';
  }

  // Toggle listening on click
  sosButton.addEventListener('click', () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
      sosButton.style.backgroundColor = "#fcbf49"; // listening color
      statusText.textContent = "Listening for emergency keywords...";
      logMessage("Listening started...");
    } else {
      recognition.stop();
      isListening = false;
      sosButton.style.backgroundColor = "#003049"; // default color
      statusText.textContent = "Stopped listening.";
      logMessage("Listening stopped.");
    }
  });

  // Handle recognition results
  recognition.onresult = event => {
    const transcript = event.results[event.results.length - 1][0].transcript
      .toLowerCase().trim();
    logMessage(`Heard: ${transcript}`);

    const isEmergency = EMERGENCY_KEYWORDS
      .some(keyword => transcript.includes(keyword));

    if (isEmergency) {
      sosButton.style.backgroundColor = "#d62828"; // emergency color
      statusText.textContent = "🚨 Emergency Detected! Alert Sent.";
      logMessage("Emergency detected!");

      // Send to backend
      fetch('http://localhost:3000/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })
      .then(res => res.json())
      .then(data => logMessage(`Server response: ${data.message}`))
      .catch(err => logMessage(`Error sending alert: ${err}`));

      // Optionally stop listening after an emergency is detected
      recognition.stop();
      isListening = false;
    }
  };

  recognition.onerror = event => {
    console.error("Recognition error:", event.error);
    statusText.textContent = `Error: ${event.error}`;
    logMessage(`Recognition error: ${event.error}`);
    sosButton.style.backgroundColor = "#003049"; // Reset color on error
    isListening = false; // Ensure listening is stopped on error
  };

  // Restart if connection drops
  recognition.onend = () => {
    if (isListening) {
      logMessage("Speech recognition ended unexpectedly. Restarting...");
      recognition.start();
    }
  };
}

// Fake Call functionality
const fakeCallButton = document.getElementById('fake-call');
const fakeCallModal = document.getElementById('fake-call-modal');
const answerBtn = document.getElementById('answer-btn');
const declineBtn = document.getElementById('decline-btn');
const ringtone = document.getElementById('ringtone');

if (fakeCallButton && fakeCallModal && answerBtn && declineBtn && ringtone) {
  fakeCallButton.addEventListener('click', () => {
    fakeCallModal.style.display = 'block';
    ringtone.play();
  });

  answerBtn.addEventListener('click', () => {
    fakeCallModal.style.display = 'none';
    ringtone.pause();
    ringtone.currentTime = 0;
    alert('Simulating answering a fake call.'); // Replace with actual call simulation if needed
  });

  declineBtn.addEventListener('click', () => {
    fakeCallModal.style.display = 'none';
    ringtone.pause();
    ringtone.currentTime = 0;
  });

  // Close modal if clicked outside
  window.addEventListener('click', (event) => {
    if (event.target === fakeCallModal) {
      fakeCallModal.style.display = 'none';
      ringtone.pause();
      ringtone.currentTime = 0;
    }
  });
} else {
  console.warn("One or more fake call elements not found.");
}