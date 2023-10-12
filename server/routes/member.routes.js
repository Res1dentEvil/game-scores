const Router = require("express");
const GroupMember = require("../models/GroupMember");
const Group = require("../models/Group");

const Role = require("../models/Role");
const router = new Router();

router.post(
  "/create",

  async (req, res) => {
    try {
      const { groupID, memberName, email, avatar, memberParties } = req.body;
      const currentGroup = await Group.findOne({ _id: groupID });
      if (currentGroup) {
        const member = new GroupMember({
          memberName: memberName,
          email: email,
          avatar: avatar,
          memberParties: memberParties,
        });
        await member.save();

        const editGroup = await Group.findOne({ _id: groupID });
        const { members } = editGroup;
        // console.log("members");
        await Group.findOneAndUpdate(
          { _id: groupID },
          {
            members: [...members, member],
          }
        );
        // await editGroup.save();
        return res.json(editGroup);

        // return res.json({ message: `group was created` });
      } else {
        return res.status(400).json({ message: `member error` });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "create member error" });
    }
  }
);

module.exports = router;
