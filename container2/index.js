const express = require("express");
const bodyParser = require("body-parser");
const Firestore = require("@google-cloud/firestore");

const app = express();

app.use(bodyParser.json());

const firestore = new Firestore({
    projectId: 'edu-project-390516',
    keyFileName: './edu-project-390516-ea8e0196f717.json'
});

app.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        
        const querySnapshot = await firestore.collection('Reg').where('email', '==', email).where('password', '==', password).get();
        if (!querySnapshot.empty) {
            res.status(200).json({ message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid login credentials' });
        }
    } catch (error) {
        console.error("Error logging in");
        res.status(500).json({ error: 'Login Failed'});
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Microservice 2 is running on port ${port}`);
});