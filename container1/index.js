const express = require("express");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");

const app = express();
const firestore = new Firestore({
    projectId: 'edu-project-390516',
    keyFileName: './edu-project-390516-ea8e0196f717.json'
});

app.post('/register', async (req, res) => {
    try {
      const { name, password, email, location } = req.body;
  
      // Create a new document in the "Reg" collection with registration data
      const registrationRef = firestore.collection('Reg').doc();
      await registrationRef.set({
        name,
        password,
        email,
        location,
        status: 'offline'
      });
  
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
});
  

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Microservice 1 is running on port ${port}`);
});
  