const express = require("express");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");
const fireBaseAdmin = require("firebase-admin");

const app = express();
app.use(bodyParser.json());
app.use(express.json());


const fireBaseAdminCred = require("./edu-project-390516-ea8e0196f717.json");
fireBaseAdmin.initializeApp({
  credential: fireBaseAdmin.credential.cert(fireBaseAdminCred)
});

const db = fireBaseAdmin.firestore();

app.post('/register', async (req, res) => {
      const { name, password, email, location } = req.body;
  
      // Create a new document in the "Reg" collection with registration data
      db.collection("Reg").add({
        name,
        password,
        email,
        location
      }).then(() => {
        res.status(200).json({ message: 'Registration successful' });
      }).catch((error) => {
        res.status(500).json({error: "Registration failed"});
      });
});
  

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Microservice 1 is running on port ${port}`);
});
  