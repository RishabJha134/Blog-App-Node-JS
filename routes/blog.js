const { Router } = require("express");
const path = require("path");
const router = Router();
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  console.log(req);
  console.log(req.file);
  console.log(req.body);
  console.log("req.user" + req.user._id);
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });

  console.log(blog);

  // return res.redirect(`/blog/${blog._id}`);
  return res.redirect("/");
});

router.get("/:id", async function (req, res) {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  console.log("comment->" + comments);
  console.log("blog->" + blog);
  // console.log("req.user->" + req.user);
  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.post("/comment/:blogId", async function (req, res) {
  console.log("req.body->"+req.body)
   await Comment.create({
   
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
   res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;

// code:-
