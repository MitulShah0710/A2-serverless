const express = require('express');
const Firestore = require('@google-cloud/firestore');

const app = express();

// Firestore configuration
const firestore = new Firestore({
    projectId: 'edu-project-390516',
    keyFileName: './edu-project-390516-ea8e0196f717.json'
});

// Middleware to update user state to "online" in Firestore when logged in
const updateUserState = async (req, res, next) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) {
    try {
      // Update the user state to "online" in Firestore
      await firestore.collection('state').doc(sessionId).set({ state: 'online' });
    } catch (error) {
      console.error('Error updating user state:', error);
    }
  }
  next();
};

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
};

// Endpoint to start a new session
app.post('/login', async (req, res) => {
  try {
    // Code to validate the login credentials and start a new session
    // ...

    // Generate a new session ID and store it in the response headers
    const sessionId = generateSessionId();
    res.setHeader('x-session-id', sessionId);
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Endpoint to retrieve session information
app.get('/session', isLoggedIn, async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  try {
    // Code to retrieve session information from Firestore
    // ...

    res.status(200).json({ sessionId, /* session data */ });
  } catch (error) {
    console.error('Error retrieving session information:', error);
    res.status(500).json({ error: 'Session data not found' });
  }
});

// Endpoint to end a session
app.post('/logout', isLoggedIn, async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  try {
    // Code to update user state to "offline" in Firestore and delete the session
    // ...

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
