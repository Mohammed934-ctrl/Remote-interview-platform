import { ChatClient } from "../lib/Stream.js";

export const getStreamtoken = async (req, res) => {
  try {
    const token = ChatClient.createToken(req.user.clerkId);

    res.status(200).json({
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.Image,
    });
  } catch (error) {
    console.error("error in getstream token controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
