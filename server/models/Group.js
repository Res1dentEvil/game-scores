const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  // id: { type: String, unique: true },
  groupName: { type: String, unique: true },
  groupMode: { type: String },
  members: [{ type: String, ref: "GroupMember" }],
  administrators: [{ userName: String, email: String }],
  parties: [{ type: Types.ObjectId, ref: "Party" }],
  followers: [{ type: Types.ObjectId, ref: "User" }],
  isPremium: { type: Boolean, default: false },
});

module.exports = model("Group", schema);
