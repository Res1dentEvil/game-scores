const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  date: { type: Date },
  gameName: { type: String },
  duration: { type: Number },
  partyMembers: [{ memberName: String, points: Number }],
  winners: [{ type: String }],
  winDescription: { type: String },
});

module.exports = model("Party", schema);
