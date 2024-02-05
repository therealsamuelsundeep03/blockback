const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  // _id: String,
  email: String,
  userName: String,
  password: String,
  blogs: [{
    title: String, 
    post: String,
    category: String,
    createdAt: {
      type: Date,
      // default: Date.now
    }
  }],
},{
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);
