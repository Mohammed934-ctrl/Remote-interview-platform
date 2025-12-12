import express from "express";
const app = express();

import { ENV } from "../lib/env.js";
import {  connectionDB } from "../lib/DB.js";

// console.log(ENV.PORT)
app.get("/", (req, res) => {
  res.status(200).json({
    msg: "hello from server file",
  });
});

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


startserver()