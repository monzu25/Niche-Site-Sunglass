const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

// All Middleware
app.use(cors());
app.use(express.json());

// Database Configuration connection string

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.11wfa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log('Woow! I got it Connect', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });








// Run Function by Mizan
async function run() {
    try {
        await client.connect();
        const database = client.db('sunglass_point');

        //Table  Collections
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('order');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');



        //====Products Collection APIs Starts ====//  


        // GET Products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });


        //===== GET Single products with ID ======//
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await productsCollection.findOne(query);
            res.json(singleProduct);
        });


        //Add Product ti database =====////

        app.post('/product/add', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })
        ///*************Products Collection APIs Ends**********//







        ///========== Order Collection APIs Starts ==========///


        // POST an Order
        app.post('/order/add', async (req, res) => {
            const cursor = req.body;
            const result = await orderCollection.insertOne(cursor);
            res.json(result);
        });

        // Get All Order
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET Single User Order Data
        app.get('/order/:email', async (req, res) => {
            const cursor = req.params.email;
            const query = { userEmail: cursor };
            const result = await orderCollection.find(query).toArray();
            res.json(result);
        });

        // DELETE Single Order 
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        app.put('/order/status/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: 'confirm' } };
            const result = await orderCollection.updateOne(query, updateDoc);
            console.log(result);
            res.json(result);
        });


        //******** Order Collection APIs Ends ******//






        ///==== Review Collection APIs Starts ======///


        app.post('/review/add', async (req, res) => {
            const cursor = req.body;
            console.log(cursor);
            const result = await reviewCollection.insertOne(cursor);
            res.json(result);
        });

        // get review 

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // get reaview With Email Based 

        app.get('/review/:email', async (req, res) => {
            const cursor = req.params.email;
            const query = { email: cursor };
            const result = await reviewCollection.find(query).toArray();
            res.json(result);
        })


        ///*********Review Collection APIs Ends ******8//




        //================== Users Collection APIs Starts =========//


        app.post('/users', async (req, res) => {
            const cursor = req.body;
            const result = await usersCollection.insertOne(cursor);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })


        //******* Users Collection APIs Ends ******//


    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('I am from Node Server');
});

app.listen(port, () => {
    console.log('Listening Port ', port);
})