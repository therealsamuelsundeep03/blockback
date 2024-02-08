const jwt = require("jsonwebtoken");
require("dotenv").config();

const controller = {
  async test(req, res) {
    try {
      console.log(req);
      console.log("sam");
      const data = jwt.sign({ name: "sam" }, process.env.ACCESS_TOKEN, {
        expiresIn: "10s",
      });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
  async getTest(req, res) {
    try {
      res.status(200).json({ test: "success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  },
};

module.exports = controller;
