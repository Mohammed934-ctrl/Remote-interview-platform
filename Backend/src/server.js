import express from "express";
import path from "path";
import { serve } from "inngest/express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import chatroute from "./Routes/ChatRoute.js";
import Sessionroute from "./Routes/SessionRoute.js";
const app = express();

import { ENV } from "./lib/env.js";
import { connectionDB } from "./lib/DB.js";
import { inngest, functions } from "./lib/inngest.js";


const __dirname = path.resolve();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware());



app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/chat", chatroute);
app.use("/api/sessions", Sessionroute);

if ((ENV.NODE_ENV == "production")) {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get("*", (req, res) => {
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
