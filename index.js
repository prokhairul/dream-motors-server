const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@dream-motors.ki5epjy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        await client.connect();
        console.log('Database Connected')

        const productCollection = client.db('dream_motors').collection('products');
        const reviewCollection = client.db('dream_motors').collection('reviews');

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })


    }

    finally {

    }
}


run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Dream Motors Server Running!')
})

app.listen(port, () => {
    console.log(`Dream Motor's On ${port}`)
})