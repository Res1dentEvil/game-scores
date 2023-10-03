const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  // id: { type: String, unique: true },
  memberName: { type: String },
  email: { type: String },
  avatar: { type: String },
  memberParties: [{ type: Types.ObjectId, ref: "Party" }],
  roles: [{ type: String, default: "GROUP_MEMBER" }],
});

module.exports = model("GroupMember", schema);
