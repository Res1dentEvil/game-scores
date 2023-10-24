const Router = require("express");
const Group = require("../models/Group");
const router = new Router();

router.post(
  "/create",

  async (req, res) => {
    try {
      const { groupID, title, image } = req.body;
      const currentGroup = await Group.findOne({ _id: groupID });

      if (currentGroup) {
        const game = {
          title: title,
          image: image,
        };

        const editGroup = await Group.findOne({ _id: groupID });
        const { gamesList } = editGroup;

        await Group.findOneAndUpdate(
          { _id: groupID },
          {
            gamesList: [...gamesList, game],
          }
        );

        return res.json(editGroup);

        // return res.json({ message: `group was created` });
      } else {
        return res.status(400).json({ message: `game error` });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "create member error" });
    }
  }
);

module.exports = router;
