const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

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
        const bookingCollection = database.collection("bookings");

        // Showing All Package into Home Page
        app.get('/tourpackages', async (req, res) => {
            const cursor = tourCollection.find({});
            const tourPackages = await cursor.toArray();
            res.send(tourPackages);
        });

        // Showing Single Package Into Private Route
        app.get('/tourpackages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tourPackage = await tourCollection.findOne(query);
            res.json(tourPackage);
        });

        // Adding New Package into Database
        app.post('/tourpackages', async (req, res) => {
            const newTourPack = req.body;

            const result = await tourCollection.insertOne(newTourPack);
            res.json(result);
        });

        // Confirm Booking
        app.post('/bookings', async (req, res) => {
            const booking = req.body;

            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        });

        // Showing Bookings Into UI
        app.get('/bookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookingPackages = await cursor.toArray();
            res.send(bookingPackages);
        });

        // Delete Booking
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });

        // My Booking
        app.get('/bookings/:userEmail', async (req, res) => {
            const result = await bookingCollection.find({ userEmail: req.params.userEmail }).toArray();
            res.send(result);
        });

        // UPDATE Status
        app.put("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const query = { _id: ObjectId(id) };
            console.log(updatedStatus)
            // const result = await bookingCollection.
        })

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