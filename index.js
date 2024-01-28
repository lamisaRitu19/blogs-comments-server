const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const blogs = require("./blogs.json");
const comments = require("./comments.json");

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/blogs", (req, res) => {
  res.send(blogs);
});

app.get("/comments", (req, res) => {
  res.send(comments);
});

app.listen(port, () => {
  console.log(`Blogs&Comments is running on port ${port}`);
});
