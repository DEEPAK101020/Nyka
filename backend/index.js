const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();




// Redirect users to Google OAuth login page
app.get('/auth/google', (req, res) => {
    const params = {
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        response_type: 'code',
        scope: 'profile email',
    };
    const authUrl = `https://accounts.google.com/o/oauth2/auth?${querystring.stringify(params)}`;
    res.redirect(authUrl);
});

// Callback URL after Google OAuth login
app.get('/google/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange code for access token
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const accessToken = data.access_token;

        // Use access token to fetch user info
        const { data: userData } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        // You can use userData to retrieve user details
        console.log(userData);
        
        // Redirect user or do something else with user data
        res.send(userData);
    } catch (error) {
        console.error('Error exchanging code for access token:', error.response.data.error);
        res.status(500).send('Error exchanging code for access token');
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
