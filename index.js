require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/Users");
const post = require("./routes/Posts");
const app = express();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB connected");
  });

app.use(cors());
app.use("/Images", express.static("Images"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", user);
app.use("/posts", post);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
