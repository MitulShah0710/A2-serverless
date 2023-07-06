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

app.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        db.collection("Reg")
            .where("email", "==", email)
            .where("password", "==", password)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    res.status(401).json({ error: "Login failed." });
                } else {
                    const documentId = querySnapshot.docs[0].id;

                    db.collection("state")
                        .where("userId", "==", documentId)
                        .get()
                        .then((stateSnapshot) => {
                            if (stateSnapshot.empty) {
                                db.collection("state").add({
                                    userId: documentId,
                                    timestamp: fireBaseAdmin.firestore.FieldValue.serverTimestamp(),
                                    state: "online",
                                });
                            } else {
                                const stateDocId = stateSnapshot.docs[0].id;
                                db.collection("state").doc(stateDocId).update({
                                    state: "online",
                                    timestamp: fireBaseAdmin.firestore.FieldValue.serverTimestamp(),
                                });
                            }
                            res.status(200).json({ message: "Login Successful", documentId });
                        });
                }
            })
            .catch((error) => {
                console.error("Error occurred in login:", error);
                res.status(500).json({ error: "Login Failed" });
            });
    }catch(error) {
        console.log(error);
        res.status(500).json({message: "Error occurred"});
    }
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Microservice 2 is running on port ${port}`);
});