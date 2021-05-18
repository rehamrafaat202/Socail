const express = require("express");
const auth = require("../middleware/auth");
const { Post, validate } = require("../models/post");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const posts = await Post.find({}).populate("user");
  res.status(200).send(posts);
});

router.post("/", auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.user = req.user._id
  const post = new Post(req.body);

  try {
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  let post = await Post.findById(req.params.id).populate("user");
  if (!post) return res.status(404).send("Post not found");

  if (post.user._id != req.user._id) return res.status(403).send("Forbidden");
  
  try {
    await post.set(req.body).save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.send("Post is already not exist");

  if (post.user != req.user._id) return res.status(403).send("Forbidden");

  await post.delete();
  res.status(204).send(post);
});

module.exports = router;
