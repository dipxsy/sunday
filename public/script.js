const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-button');
const spinnerContainer = document.getElementById('spinner-container');
const responseContainer = document.getElementById('response-container');

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = messageInput.value;
  messageInput.value = '';

  // Disable the send button and show the spinner
  sendButton.disabled = true;
  spinnerContainer.style.display = 'block';

  // Send the user message to the server
  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  // Get the response from the server
  const reply = await response.text();

  // Clear the response container and display the new response
  responseContainer.innerHTML = '';
  const replyElement = document.createElement('p');
  replyElement.textContent = reply;
  responseContainer.appendChild(replyElement);

  // Enable the send button and hide the spinner
  sendButton.disabled = false;
  spinnerContainer.style.display = 'none';
});
