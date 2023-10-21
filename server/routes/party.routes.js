const Router = require("express");
const GroupMember = require("../models/GroupMember");
const Party = require("../models/Party");
const Group = require("../models/Group");

const Role = require("../models/Role");
const router = new Router();

router.post(
  "/create",

  async (req, res) => {
    try {
      const { party, groupID } = req.body;
      const currentGroup = await Group.findOne({ _id: groupID });

      if (currentGroup) {
        const newParty = {
          date: party.date,
          gameName: party.gameName,
          duration: party.duration,
          partyMembers: party.partyMembers,
          winners: party.winners,
          winDescription: party.winDescription,
        };
        // await newParty.save();

        const editGroup = await Group.findOne({ _id: groupID });
        const { parties } = editGroup;
        await Group.findOneAndUpdate(
          { _id: groupID },
          {
            parties: [...parties, newParty],
          }
        );
        return res.json(editGroup);
        // return res.json({ message: `group was created` });
      } else {
        return res.status(400).json({ message: `party error` });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "create party error" });
    }
  }
);

module.exports = router;
