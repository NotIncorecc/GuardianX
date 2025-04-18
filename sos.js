const sosButton = document.getElementById("sos-button");
const statusText = document.getElementById("status-text");

let recognition;

// Check for browser compatibility
if (!('webkitSpeechRecognition' in window)) {
  alert("Your browser doesn't support speech recognition. Try Chrome.");
} else {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;

  // Emergency keywords from GitHub repo
  const EMERGENCY_KEYWORDS = ["help", "save me", "please help", "emergency"];

  // What happens after speech is detected
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Transcript:", transcript);

    const isEmergency = EMERGENCY_KEYWORDS.some(keyword => transcript.includes(keyword));

    if (isEmergency) {
      sosButton.style.backgroundColor = "#d62828"; // Red for emergency
      statusText.textContent = "Emergency Detected! Sending alerts...";
      // TODO: Add alert/crypto logic
    } else {
      sosButton.style.backgroundColor = "#003049"; // Reset to normal
      statusText.textContent = "No emergency detected.";
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
    statusText.textContent = "Error during voice recognition.";
    sosButton.style.backgroundColor = "#003049";
  };
}

// Start listening when SOS button is clicked
sosButton.addEventListener("click", () => {
  if (recognition) {
    statusText.textContent = "Listening for emergency voice command...";
    sosButton.style.backgroundColor = "#9c6644"; // Listening mode
    recognition.start();
  }
});

