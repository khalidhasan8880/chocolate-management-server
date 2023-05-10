const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
// middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.sgqndpo.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    

    const chocolatesCollections = client.db("chocolateDb").collection("chocolates")
 
    app.post('/chocolates', async (req, res)=>{
        console.log(req.body);
        const result = await chocolatesCollections.insertOne(req.body);
        res.send(result)
    })
    app.put('/chocolates/:id', async (req, res)=>{
        const id = req.params.id;
        const chocolate = req.body;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        updateChocolate = {
            $set:{
                photo:chocolate.photo,
                name:chocolate.name,
                company:chocolate.company,
                price:chocolate.price
            }
        }
        const result = await chocolatesCollections.updateOne(filter, updateChocolate, options);
        res.send(result)
    })
    app.delete('/chocolates/:id', async (req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const result = await chocolatesCollections.deleteOne(filter);
        res.send(result)
    })
    app.get('/chocolates/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await chocolatesCollections.findOne(query);
        res.send(result)
    })

    app.get('/chocolates', async (req, res)=>{
        const chocolates = chocolatesCollections.find();
        const result = await chocolates.toArray()
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);








app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})