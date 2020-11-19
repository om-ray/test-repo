let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ProgressSchema = new Schema({
  Username: String,
  Email: String,
  DatesWon: Array,
  CreatedAt: {
    type: String,
    default: new Date(),
  },
});

let ProgressModel = mongoose.model("progress", ProgressSchema);

module.exports = ProgressModel;
