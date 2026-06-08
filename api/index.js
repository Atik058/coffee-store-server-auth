const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.port || 3000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwwf8my.mongodb.net/?appName=Cluster0`;

// const uri = "mongodb+srv://coffee-store:<db_password>@cluster0.bwwf8my.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const coffeesCollection = client.db('coffeeDB').collection('coffees');
    const usersCollection = client.db('coffeeDB').collection('users');

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body
      console.log(newCoffee)
      const result = await coffeesCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.get('/coffees', async (req, res) => {
      const result = await coffeesCollection.find().toArray();
      console.log(result)
      res.send(result);
    })

    app.get('/', async (req, res) => {
      
      res.send("this is main root");
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const projection = { _id: new ObjectId(id) }
      const result = await coffeesCollection.findOne(projection)
      console.log(result)
      res.send(result);
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedCoffee = req.body;
      const updateDocument = {
        $set: updatedCoffee
      };
      const options = { upsert: true };
      const result = await coffeesCollection.updateOne(filter, updateDocument, options);
      res.send(result)
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.deleteOne(query);
      res.send(result)
    })

    // user api
    app.post('/users', async (req, res) => {
      const newUser = req.body
      console.log(newUser)
      const result = await usersCollection.insertOne(newUser)
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      console.log(result)
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


module.exports = app;