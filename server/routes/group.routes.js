const Router = require("express");
const User = require("../models/User");
const Group = require("../models/Group");

const Role = require("../models/Role");
const router = new Router();

router.post(
  "/create",

  async (req, res) => {
    try {
      const {
        groupName,
        groupMode,
        members,
        administrators,
        parties,
        isPremium,
      } = req.body;
      const firstFollowerEmail = administrators[0].email;
      const firstFollower = await User.findOne({ firstFollowerEmail });
      const potentialGroup = await Group.findOne({ groupName });
      if (!potentialGroup) {
        const group = new Group({
          groupName: groupName,
          groupMode: groupMode,
          members: members,
          administrators: administrators,
          parties: parties,
          followers: [firstFollower],
          isPremium: isPremium,
        });
        await group.save();

        //adding this group to the user groups
        const currentGroup = await Group.findOne({ groupName });
        const user = await User.findOne({ firstFollowerEmail });
        const { id, groups } = user;
        await User.findOneAndUpdate(
          { _id: id },
          {
            groups: [...groups, currentGroup._id],
          }
        );
        await user.save();
        return res.json(user);

        // return res.json({ message: `group was created` });
      } else {
        return res
          .status(400)
          .json({ message: `group with this name already exists` });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "create group error" });
    }
  }
);

router.post(
  "/profile/groups",

  async (req, res) => {
    try {
      const groupsIDs = req.body.data;
      const groups = await Promise.all(
        groupsIDs.map(async (groupID) => {
          const group = await Group.findOne({ _id: groupID });
          return group;
        })
      );

      return res.json(groups);
    } catch (e) {
      console.log(e);
      res.send({ message: "error" });
    }
  }
);

module.exports = router;
