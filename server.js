const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const SECRET_KEY = '0x4AAAAAAAg8O6JA1VgBuJke0bRsTRwW8Mg';

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.post('/validate-captcha', async (req, res) => {
    const token = req.body['cf-turnstile-response'];

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: new URLSearchParams({
                secret: SECRET_KEY,
                response: token
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const result = await response.json();

        if (result.success) {
            // Redirect to Discord login or handle successful validation
            const clientId = 'your-client-id-here'; // Replace with your Discord client ID
            const redirectUri = encodeURIComponent('https://your-redirect-uri-here'); // Replace with your redirect URI
            const scope = 'identify email';

            const authUrl = `https://discord.com/oauth2/authorize?client_id=1220328191470735441&response_type=code&redirect_uri=https%3A%2F%2Fsaifmohmed1.github.io%2Fcallback&scope=email+identify`;

            res.json({ success: true, redirectUrl: authUrl });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});