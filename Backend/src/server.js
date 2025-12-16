import express from "express";
import path from "path"
import { serve } from "inngest/express";
import cors from "cors"
const app = express();


import { ENV } from "../lib/env.js";
import { connectionDB } from "../lib/DB.js";
import { inngest,functions } from "./lib/inngest.js";

const __dirname = path.resolve();




app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))



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



app.use("/api/inngest",serve({client:inngest,functions}))

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
