const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/auth.routes");
const groupRouter = require("./routes/group.routes");

const app = express();
const corsMiddleware = require("./middleware/cors.middleware");
app.use(corsMiddleware);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/group", groupRouter);

const PORT = process.env.PORT || config.get("serverPort");
const start = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"));
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}...`);
    });
  } catch (e) {}
};

start();
