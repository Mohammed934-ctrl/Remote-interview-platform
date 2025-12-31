import Session from "../Models/Session.schema.js";
import { ChatClient, newStreamClient } from "../lib/Stream.js";

export const Createsession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user?.clerkId;
    if (!clerkId) {
      return res.status(401).json({ message: "Clerk ID missing" });
    }
    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "problem and difficulty field are required" });
    }
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    let session;
    //create stream video call
    const call = newStreamClient.video.call("default", callId);
    await call.getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
        },
      },
    });

    try {
      //create stream chat
      const channel = ChatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });

      await channel.create();

      session = await Session.create({
        problem,
        difficulty,
        host: userId,
        callId,
      });
    } catch (streamerror) {
      await call.delete({ hard: true }).catch(console.error);
      throw streamerror;
    }

    res.status(200).json({ sessions: session });
  } catch (error) {
    console.error("Error in createSession controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getactivesession = async (_, res) => {
  try {
    const session = await Session.find({ status: "Active" })
      .populate("host", "name email profileImage ClerkId")
      .populate("participant", "name email profileImage ClerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions: session });
  } catch (error) {
    console.error(
      "error in  getting active session controller ",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getmyrecentsession = async (req, res) => {
  try {
    const userId = req.user._id;

    const session = await Session.find({
      status: "Completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions: session });
  } catch (error) {
    console.error("error in getting recent session controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getsessionbyid = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("host", " name email profileImage ClerkId")
      .populate("participant", "name email profileImage ClerkId");

    if (!session) return res.status(404).json({ message: "Session not foun" });

    res.status(200).json({ sessions: session });
  } catch (error) {
    console.error("error in get session by id controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinsession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() == userId.toString()) {
      return res
        .status(400)
        .json({ message: "Host cannot join their own session as participant" });
    }

    if (session.participant) {
      return res.status(409).json({ message: "Session is already full " });
    }

    if (session.status != "Active") {
      return res
        .status(400)
        .json({ message: " Cannot join a  completed session" });
    }

    session.participant = userId;
    await session.save();

    const channel = ChatClient.channel("messaging", session.callId);

    await channel.addMembers([clerkId]);
    res.status(200).json({ sessions: session });
  } catch (error) {
    console.error("Error in join session controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const endsession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== userId.toString()) {
      return res
        .status(404)
        .json({ message: "Only the host can end the session" });
    }
    if (session.status === "Completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    const call = newStreamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    const channel = ChatClient.channel("messaging", session.callId);
    await channel.delete();
    session.status = "Completed";
    await session.save();

    res
      .status(200)
      .json({ sessions: session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
