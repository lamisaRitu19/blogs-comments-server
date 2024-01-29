const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const blogs = require("./blogs.json");
// const comments = require("./comments.json");

// mongodb start
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s16j3n1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Get the database and collections on which to run the operation
    const blogCollection = client.db("blogsComments").collection("blogs");
    const commentCollection = client.db("blogsComments").collection("comments");

    // ------------------------queries for blog collection----------------------

    app.get("/blogs", async (req, res) => {
      const blogs = await blogCollection.find().toArray();
      res.send(blogs);
    });

    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: parseInt(id) };
      const data = req.body;
      const updatedBlog = {
        $set: {
          title: data.title,
          body: data.body,
        },
      };
      const result = await blogCollection.updateOne(filter, updatedBlog);
      res.send(result);
    });

    app.delete("/blogs", async (req, res) => {
      const blog = req.body;
      const filter = { id: parseInt(blog.deleteId) };
      const result = await blogCollection.deleteOne(filter);
      res.send(result);
    });

    // ------------------------queries for comment collection----------------------

    app.get("/comments", async (req, res) => {
      const comments = await commentCollection.find().toArray();
      res.send(comments);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// mongodb end

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.listen(port, () => {
  console.log(`Blogs&Comments is running on port ${port}`);
});
