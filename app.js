const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { textToSpeech } = require('./speak');
const config = require('./config');

const app = express();
const port = 3000;

// Set up the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());

// Function to get the current time
function getCurrentTime() {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true });
  return currentTime;
}

// Function to get the current date
function getCurrentDate() {
  const currentDate = new Date().toLocaleDateString('en-US');
  return currentDate;
}

// Function to get the current day
function getCurrentDay() {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = new Date().getDay();
  const currentDay = daysOfWeek[currentDayIndex];
  return currentDay;
}

// Render the index page
app.get('/', (req, res) => {
  res.render('index', { isAuthorized: false });
});

// Handle form submission
app.post('/chat', async (req, res) => {
  // Check if the user is authorized
  if (!req.body.authorization || req.body.authorization !== 'dipxsy') {
    return res.send('Access Denied');
  }

  try {
    const message = req.body.message;

    // Make a request to the Carter API
    const carterResponse = await axios.post('https://api.carterlabs.ai/chat', {
      text: message,
      key: 'd50d870a-e752-42b2-8d4d-eab44cf0729d',
      playerId: '119001756',
      speak: false
    });

    // Get the response text from Carter
    let carterReply = carterResponse.data.output.text;

    // Check if forced behaviors are triggered
    const forcedBehaviors = carterResponse.data.forced_behaviours;

    if (forcedBehaviors && forcedBehaviors.length > 0) {
      // Iterate through the forced behaviors
      for (const behavior of forcedBehaviors) {
        const forcedBehaviorName = behavior.name;

        if (forcedBehaviorName === 'time') {
          // Forced behavior "time" is triggered
          const currentTime = getCurrentTime();
          carterReply += `\nCurrent time is ${currentTime}.`;
        } else if (forcedBehaviorName === 'date') {
          // Forced behavior "date" is triggered
          const currentDate = getCurrentDate();
          carterReply += `\nCurrent date is ${currentDate}.`;
        } else if (forcedBehaviorName === 'day') {
          // Forced behavior "day" is triggered
          const currentDay = getCurrentDay();
          carterReply += `\nToday is ${currentDay}.`;
        }
      }
    }

    // Speak the response using ElevenLabs textToSpeech function
    const audioData = await textToSpeech(carterReply);

    // Send the response from Carter back to the client
    res.send(carterReply);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
