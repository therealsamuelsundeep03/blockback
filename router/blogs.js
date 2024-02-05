const express = require("express");
const router = express.Router();
const controller = require("../controller/blogs");

router.post("/", controller.addBlogs);
router.get("/", controller.getBlogs);
router.get("/:user", controller.myBlogs);
router.get("/:user/:blog", controller.getBlog);
router.put("/:user/:blog", controller.editBlog);
router.delete("/:user/:blog", controller.deleteBlog);

module.exports = router;
