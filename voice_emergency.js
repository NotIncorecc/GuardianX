// Frontend voice-emergency.js

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Speech Recognition API not supported in this browser. Try Chrome or Edge.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';

  // Emergency keywords
  const EMERGENCY_KEYWORDS = ['help', 'save me', 'please help', 'emergency', 'call police'];

  // UI elements
  const sosButton = document.getElementById('sos-button');
  const statusText = document.getElementById('status-text');
  let isListening = false;

  // Toggle listening on click
  sosButton.addEventListener('click', () => {
    if (!isListening) {
      recognition.start();
      isListening = true;
      sosButton.style.backgroundColor = "#fcbf49"; // listening color
      statusText.textContent = "Listening for emergency keywords...";
    } else {
      recognition.stop();
      isListening = false;
      sosButton.style.backgroundColor = "#003049"; // default color
      statusText.textContent = "Stopped listening.";
    }
  });

  // Handle recognition results
  recognition.onresult = event => {
    const transcript = event.results[event.results.length - 1][0].transcript
      .toLowerCase().trim();
    console.log("Heard:", transcript);

    const isEmergency = EMERGENCY_KEYWORDS
      .some(keyword => transcript.includes(keyword));

    if (isEmergency) {
      sosButton.style.backgroundColor = "#d62828"; // emergency color
      statusText.textContent = "🚨 Emergency Detected! Alert Sent.";

      // Send to backend
      fetch('http://localhost:3000/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })
      .then(res => res.json())
      .then(data => console.log("Server:", data.message))
      .catch(err => console.error("Error sending alert:", err));
    }
  };

  recognition.onerror = event => {
    console.error("Recognition error:", event.error);
    statusText.textContent = `Error: ${event.error}`;
  };

  // Restart if connection drops
  recognition.onend = () => {
    if (isListening) recognition.start();
  };
}
