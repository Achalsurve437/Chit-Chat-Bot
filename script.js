const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const typingIndicator = document.getElementById("typing-indicator");

// Auto-resize chat box and enable Enter key
userInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// Disable send button when input is empty
userInput.addEventListener("input", function() {
  sendButton.disabled = !this.value.trim();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message || sendButton.disabled) return;

  // Disable input during processing
  userInput.disabled = true;
  sendButton.disabled = true;

  appendMessage("user", message);
  userInput.value = "";

  // Show typing indicator
  showTypingIndicator();

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Hide typing indicator before showing response
    hideTypingIndicator();
    
    // Add small delay for better UX
    setTimeout(() => {
      appendMessage("bot", data.reply);
    }, 300);

  } catch (error) {
    hideTypingIndicator();
    appendMessage("bot", "Sorry, I'm having trouble connecting. Please try again!");
    console.error("Error:", error);
  }

  // Re-enable input
  userInput.disabled = false;
  sendButton.disabled = false;
  userInput.focus();
}

function appendMessage(sender, text) {
  // Remove welcome message if it exists
  const welcomeMsg = chatBox.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  
  const bubbleDiv = document.createElement("div");
  bubbleDiv.classList.add("message-bubble");
  bubbleDiv.innerText = text;
  
  messageDiv.appendChild(bubbleDiv);
  chatBox.appendChild(messageDiv);
  
  // Smooth scroll to bottom
  setTimeout(() => {
    chatBox.scrollTo({
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

// Initialize
sendButton.disabled = true;
userInput.focus();