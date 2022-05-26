const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

        //Database Collections
        const productCollection = client.db('dream_motors').collection('products');
        const reviewCollection = client.db('dream_motors').collection('reviews');
        const userCollection = client.db('dream_motors').collection('users');
        const orderCollection = client.db('dream_motors').collection('orders');


        //Product API
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.post('/product', async (req, res) => {
            const addProduct = req.body;
            const result = await productCollection.insertOne(addProduct);
            res.send(result);
        });

        app.delete('/product/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const result = await productCollection.deleteOne(filter);
            res.send(result);

            console.log(email)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });


        //Review API
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })

        app.post('/review', async (req, res) => {
            const addReview = req.body;
            const result = await reviewCollection.insertOne(addReview);
            res.send(result);
        });


        // Order API 

        app.post('/order', async (req, res) => {
            const addOrder = req.body;
            const result = await orderCollection.insertOne(addOrder);
            res.send(result);
        });

        app.get('/order', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        })


        //JWT Token API
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
        })


        //End Tag of Try
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