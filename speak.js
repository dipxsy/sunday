const axios = require('axios');
const config = require('./config');
const player = require('play-sound')(opts = {});

// Define a function called textToSpeech that takes in a string called inputText as its argument.
async function textToSpeech(inputText) {
  // Set the API key for ElevenLabs API.
  // Do not use directly. Use environment variables.
  const API_KEY = config.ELEVEN_LABS_API_KEY;
  // Set the ID of the voice to be used.
  const VOICE_ID = config.ELEVEN_LABS_VOICE_ID;

  // Set options for the API request.
  const options = {
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    headers: {
      accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
      'content-type': 'application/json', // Set the content type to application/json.
      'xi-api-key': `${API_KEY}`, // Set the API key in the headers.
    },
    data: {
      text: inputText, // Pass in the inputText as the text to be converted to speech.
    },
    responseType: 'arraybuffer', // Set the responseType to arraybuffer to receive binary data as response.
  };

  // Send the API request using Axios and wait for the response.
  const speechDetails = await axios.request(options);

  // Play the audio using the player
  player.play(speechDetails.data, (err) => {
    if (err) {
      console.error('Error playing audio:', err);
    }
  });
}

// Export the textToSpeech function as the default export of this module.
module.exports = { textToSpeech };
