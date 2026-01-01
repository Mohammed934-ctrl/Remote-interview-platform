import { requireAuth } from "@clerk/express";
import User from "../Models/User.schema.js";

export const ProtectRoute = [
  requireAuth(),

  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res.status(500).json({ message: "Unauthorized user" });

      const user = await User.findOne({ clerkId });
      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;
      next();
    } catch (error) {
      console.error("error in protect route middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
