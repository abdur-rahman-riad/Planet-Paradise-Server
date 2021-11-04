const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require("cors");

// Getting PORT
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// Database URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6nwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// Async Function for Database Connection
async function run() {
    try {
        await client.connect();
        const database = client.db("planetParadise");
        const tourCollection = database.collection("tourPackages");

        // POST API
        app.post('/tourpackages', async (req, res) => {
            const newTourPack = req.body;

            const result = await tourCollection.insertOne(newTourPack);
            console.log(result);
            res.json(result);
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




// Request and Response
app.get('/', (req, res) => {
    res.send("Planet Paradise Server is Running...");
});

app.listen(port, () => {
    console.log("Listening PORT: ", port);
});