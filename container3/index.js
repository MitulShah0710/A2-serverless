const express = require("express");
const cors = require("cors");
const fireBaseAdmin = require("firebase-admin");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const fireBaseAdminCred = require("../container3/edu-project-390516-ea8e0196f717.json");
fireBaseAdmin.initializeApp({
  credential: fireBaseAdmin.credential.cert(fireBaseAdminCred),
});

const db = fireBaseAdmin.firestore();

// Creating a POST API that fetches the profile of currently logged in user and all the online users
app.post("/list", (req, res) => {
  const { documentId } = req.body;

  // Fetching the current user based on the userId received in the request body
  db.collection("Reg")
    .doc(documentId)
    .get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        const documentData = docSnapshot.data();
        console.log(documentData);
        db.collection("state")
          .where("state", "==", "online")
          .get()
          .then((stateSnapshot) => {
            const onlineUserIds = stateSnapshot.docs.map(
              (doc) => doc.data().userId
            );

            db.collection("Reg")
              .where(
                fireBaseAdmin.firestore.FieldPath.documentId(),
                "in",
                onlineUserIds
              )
              .get()
              .then((onlineUsersSnapshot) => {
                const onlineUsers = onlineUsersSnapshot.docs.map(
                  (doc) => doc.data().name
                );
                console.log(onlineUsers);
                res.status(200).json({ documentData, onlineUsers });
              })
              .catch((error) => {
                console.error("Error fetching online user names:", error);
                res
                  .status(500)
                  .json({ error: "Failed to fetch online user names." });
              });
          })
          .catch((error) => {
            console.error("Error fetching online user IDs:", error);
            res.status(500).json({ error: "Failed to fetch online user IDs." });
          });
      } else {
        res.status(404).json({ error: "Document not found." });
      }
    })
    .catch((error) => {
      console.error("Error retrieving document:", error);
      res.status(500).json({ error: "Failed to retrieve document." });
    });
});

// Creating a POST API that logs the user out and updates the state in the "state" collection
app.post("/logout", (req, res) => {
  const { documentId } = req.body;

  db.collection("state")
    .where("userId", "==", documentId)
    .get()
    .then((stateSnapshot) => {
      if (stateSnapshot.empty) {
        res.status(404).json({ error: "User ID not found." });
      } else {
        const stateDocId = stateSnapshot.docs[0].id;
        db.collection("state").doc(stateDocId).update({
          state: "offline",
        });

        res.status(200).json({ message: "Logout successful." });
      }
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Failed to logout." });
    });
});

// Creating a listener on pre-defined port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
