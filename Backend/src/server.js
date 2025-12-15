import express from "express";
import path from "path"
const app = express();

import { ENV } from "../lib/env.js";
import { connectionDB } from "../lib/DB.js";

const __dirname = path.resolve();




// console.log(ENV.PORT)
app.get("/health", (req, res) => {
  res.status(200).json({
    msg: "hello from server file",
  });
});
app.get("/game", (req, res) => {
  res.status(200).json({
    msg: "game is ready",
  });
});

if ((ENV.NODE_ENV = "production")) {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
  });
}

const startserver = async () => {
  try {
    await connectionDB();
    app.listen(ENV.PORT, () => {
      console.log(`server is listening on ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("error while connecting to server try again ", error);
  }
};

startserver();
