require('dotenv').config() // dotenv file me se har ek variable ko utha raha hai.
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
// const Blog = require("./models/blog")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));

const Blog = require("./models/blog");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.json());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
// public folder ke andar jo bhi hai nh usko tum statics serve kardo.

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});


app.use("/user", userRoute);

app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
