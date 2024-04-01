const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const User = require("./modules/User.js");
const port = 5002;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./modules/Post.js");
const { info } = require("console");
//use pakage
app.use(cors({ credentials: true, origin: "http://192.168.2.10:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

//hashPassword
const salt = bcrypt.genSaltSync(10);
const secretKey = "thomax290901";
//connect db
dotenv.config();
mongoose
  .connect(process.env.CONNECTDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to Mongodb"))
  .catch((error) => {
    console.log(error);
  });

//register account
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});
//login account
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const checkPass = bcrypt.compareSync(password, userDoc.password);
  if (checkPass) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secretKey, {}, (err, token) => {
      if (err) throw err;
      res
        .cookie("token", token, {
          sameSite: "none",
          secure: true,
        })
        .json({
          id: userDoc._id,
          username,
        });
    });
  } else {
    res.status(400).json("Wrong Crendentials");
  }
});
//get profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.cookie("token", "").json("Logged out successfully");
});

//create post
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});
//update post

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    await Post.updateOne(
      { _id: id },
      {
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      }
    );
    const updatedPost = await Post.findById(id);
    res.json(updatedPost);
  });
});

//get post
app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(20)
  );
});
//find post follow id and ref author with username
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", "username");
  res.json(postDoc);
});
//deletepost
app.delete("/post/:id", async (req, res) => {
  const postId = req.params.id;

  // Tìm bài viết theo postId, kiểm tra quyền của người dùng nếu cần.
  // Sau đó xóa bài viết.
  try {
    const post = await Post.findById(postId);

    // Kiểm tra quyền, ví dụ: chỉ cho phép tác giả xóa.
    if (post.author != req.user.id) {
      return res
        .status(403)
        .json("You don't have permission to delete this post.");
    }

    // Xóa bài viết.
    await post.remove();

    res.status(200).json("Post deleted successfully.");
  } catch (err) {
    res.status(500).json("Failed to delete post: " + err);
  }
});
//port
app.listen(port, () => {
  console.log(`server is running port:${port}`);
});
