const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Discord OAuth2 credentials
const clientId = '1220328191470735441'; // Replace with your Discord client ID
const clientSecret = 'SDzrr__04DiYUX5w_O-YQ22rKx2uwkSG'; // Replace with your Discord client secret
const redirectUri = 'http://127.0.0.1:5000/callback'; // This should match the redirect URI set in your Discord application

app.use(express.static(path.join(__dirname, 'public')));

// Root route serving the HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Callback route to handle Discord response
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (code) {
    try {
      // Requesting the access token
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenResponse.data.access_token;

      // Requesting the user data
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const userData = userResponse.data;

      // Check if the user is a bot
      if (userData.bot) {
        res.send("Access denied. Bots are not allowed.");
      } else {
        res.json(userData);
      }
    } catch (error) {
      res.status(500).send('Error retrieving user data.');
    }
  } else {
    res.send('No code provided');
  }
});

// Starting the server
app.listen(5000, () => {
  console.log('Server is running on http://127.0.0.1:5000');
});