import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectionDB = async () => {
  try {
    const response = await mongoose.connect(ENV.DB_URL);
    console.log(
      "👌 connection to mongodb is successfully done :",
      response.connection.host
    );
  } catch (error) {
    console.error("something went wrong ", error);
    process.exit(1)
  }
};
