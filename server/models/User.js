const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  // id: { type: String, unique: true },
  userName: { type: String },
  email: { type: String },
  picture: { type: String },
  // groups: [{ type: String }],
  groups: [{ type: Types.ObjectId, ref: "Group" }],
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", schema);
