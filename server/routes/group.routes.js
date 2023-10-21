const Router = require("express");
const User = require("../models/User");
const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
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
      const firstFollower = await User.findOne({ email: firstFollowerEmail });
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
        const user = await User.findOne({ email: firstFollowerEmail });
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

router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id });
    await res.json(group);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Group.findOneAndDelete({ _id: req.params.id });

    //delete this group from all users
    const desiredGroup = req.params.id;
    const usersWithDesiredGroup = await User.find({
      groups: desiredGroup,
    });

    for (const user of usersWithDesiredGroup) {
      const updatedGroups = user.groups.filter((groupId) => {
        return String(groupId) !== desiredGroup;
      });

      await User.findByIdAndUpdate(
        { _id: user._id },
        { groups: updatedGroups }
      );
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
});

// router.post(
//   "/members",
//
//   async (req, res) => {
//     try {
//       const membersID = req.body;
//       const members = await Promise.all(
//         membersID.map(async (memberID) => {
//           const member = await GroupMember.findOne({ _id: memberID });
//           return member;
//         })
//       );
//       return res.json(members);
//     } catch (e) {
//       console.log(e);
//       res.send({ message: "members error" });
//     }
//   }
// );

module.exports = router;
