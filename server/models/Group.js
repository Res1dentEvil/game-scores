const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  groupName: { type: String, unique: true },
  groupMode: { type: String },
  // members: [{ type: Types.ObjectId, ref: "GroupMember" }],
  members: [
    { memberName: String, email: String, avatar: String, group: String },
  ],
  administrators: [{ userName: String, email: String }],
  // parties: [{ type: Types.ObjectId, ref: "Party" }],
  parties: [
    {
      date: String,
      gameName: String,
      duration: String,
      partyMembers: [{ name: String, point: String }],
      winners: [{ name: String, point: String }],
      winDescription: String,
    },
  ],
  followers: [{ type: Types.ObjectId, ref: "User" }],
  isPremium: { type: Boolean, default: false },
});

module.exports = model("Group", schema);
