const userDB = require("../model/user");
const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = mongoose;

const controller = {
  async addBlogs(req, res) {
    try {
      let { user, title, post, category } = req.body;
      if (!title)
        return res
          .status(400)
          .json({ message: "Title is Required", status: false });
      if (!post)
        return res
          .status(400)
          .json({ message: "Post is Required", status: false });
      if (!category)
        return res
          .status(400)
          .json({ message: "category is Required", status: false });

      // check if user exists
      const isUser = await userDB.findOne({ _id: user });
      if (!isUser)
        return res
          .status(403)
          .json({ message: "Please login again", status: false });
      // add a blog to the database
      const addBlog = await userDB.updateOne(
        { _id: user },
        {
          $push: {
            blogs: { title, post, category },
          },
        }
      );
      res.status(200).json({ message: "Blog added", status: true });
    } catch (error) {
      console.log(error);
      res.status(200).json({ error, status: false });
    }
  },

  //user's blogs
  async myBlogs(req, res) {
    try {
      // if there is no id then send an error message
      const { user } = req.params;
      if (!user)
        return res
          .status(400)
          .json({ message: "Please login again", status: false });

      // if user does not exists then send an error message
      const isUser = await userDB.findOne({ _id: user });
      if (!isUser)
        return res
          .status(403)
          .json({ message: "Please login again", status: false });

      let blogs = isUser.blogs.sort((a, b) => b?.createdAt - a?.createdAt);
      console.log(blogs);
      res
        .status(200)
        .json({
          blogs: isUser?.blogs,
          username: isUser?.userName,
          status: true,
        });
    } catch (error) {
      res.status(500).json({ error, status: false });
    }
  },

  async getBlogs(req, res) {
    try {
      const result = await userDB.aggregate([
        {
          $unwind: "$blogs",
        },
        {
          $lookup: {
            from: "users", // Replace with your actual user collection name
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: "$blogs._id",
            title: "$blogs.title",
            post: "$blogs.post",
            category: "$blogs.category",
            blog_id: "$blogs.blog_id",
            createdAt: "$blogs.createdAt",
            userName: "$user.userName", // Adjust this based on the actual field name in the users collection
            userEmail: "$user.email", // You can include additional user information if needed
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);

      res.status(200).json({ blogs: result, status: true });
    } catch (error) {
      res.status(500).json({ error, status: false });
    }
  },
  async getBlog(req, res) {
    try {
      const { user, blog } = req.params;
      if (!user || !blog)
        return res
          .status(400)
          .json({ error: "Please login again", status: false });
      let result = await userDB.findOne({ _id: user });
      let getBlog = result.blogs.filter(
        ({ _id }) => _id.toString() === blog.toString()
      )[0];

      res
        .status(200)
        .json({
          status: true,
          blog: {
            title: getBlog.title,
            post: getBlog.post,
            category: getBlog.category,
            createdAt: getBlog.createdAt,
            username: result.userName,
          },
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, status: false });
    }
  },
  async editBlog(req, res) {
    const { user, blog } = req.params;
    let { title, post, category } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ message: "Title is Required", status: false });
    if (!post)
      return res
        .status(400)
        .json({ message: "Post is Required", status: false });
    if (!category)
      return res
        .status(400)
        .json({ message: "category is Required", status: false });
    if (!user || !blog)
      return res
        .status(400)
        .json({ error: "Please login again", status: false });
        // check if user exists
      const isUser = await userDB.findOne({ _id: user });
      if (!isUser)
        return res
          .status(403)
          .json({ message: "Please login again", status: false });
          console.log(isUser)
    const updateBlog = await userDB.updateOne(
      { _id: user, "blogs._id": blog },
      { $set: {
        "blogs.$.title" : title,
        "blogs.$.post": post,
        "blogs.$.category": category
      } }
    );
    res.status(200).json({ message: "Blog updated", status: true });
  },

  // delete blogs
  async deleteBlog(req, res) {
    try {
      const { user, blog } = req.params;
      if (!user || !blog)
        return res
          .status(400)
          .json({ error: "Please login again", status: false });
      const deleteBlog = await userDB.updateOne(
        { _id: user },
        {
          $pull: {
            blogs: { _id: blog },
          },
        }
      );

      res.status(200).json({ message: "Blog deleted", status: true });
    } catch (error) {
      res.status(500).json({ error, status: false });
    }
  },
};

module.exports = controller;
