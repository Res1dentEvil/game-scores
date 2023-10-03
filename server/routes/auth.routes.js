const Router = require("express");
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/registration",

  async (req, res) => {
    try {
      const { id, name, email, picture } = req.body;
      const candidate = await User.findOne({ id });
      if (!candidate) {
        const userRole = await Role.findOne({ value: "USER" });
        const user = new User({
          // id: id,
          userName: name,
          email: email,
          picture: picture,
          groups: [],
          roles: [userRole.value],
        });
        await user.save();
        return res.json({ message: "User was created" });
      } else {
        return res.json({ message: "User already exists." });
      }
    } catch (e) {
      console.log(e);
      res.send({ message: "Registration error" });
    }
  }
);

router.post(
  "/user",

  async (req, res) => {
    try {
      const email = req.body.data;
      const user = await User.findOne({ email: email });
      return res.json(user);
    } catch (e) {
      console.log(e);
      res.send({ message: "user error" });
    }
  }
);

module.exports = router;
