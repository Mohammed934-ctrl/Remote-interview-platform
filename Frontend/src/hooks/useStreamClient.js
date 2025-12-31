import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import {
  initializeStreamClient,
  disconnectStreamclient,
} from "../lib/stream.js";
import { SessionApi } from "../api/session.js";

function useStreamClient(session, loadingsesssion, isHost, isParticipant) {
  // Stream VIDEO client (connects user to Stream for video calls)
  const [streamClient, setStreamClient] = useState(null);

  // Actual VIDEO call room (mic, camera, participants, join/leave)
  const [call, setCall] = useState(null);

  // Stream CHAT client (handles messaging)
  const [chatClient, setChatClient] = useState(null);

  // Specific CHAT channel / room
  const [channel, setChannel] = useState(null);

  // Loading state while video + chat are initializing
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videocall = null;
    let chatClientInstance = null;

    const initcall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "Completed") return;

      try {
        const { token, userId, userName, userImage } =
          await SessionApi.getStreamToken();

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        setStreamClient(client);

        videocall = client.call("default", session.callId);
        await videocall.join({ create: true });
        setCall(videocall);

        const apiKey = import.meta.env.VITE_STREAM_API;

        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        setChatClient(chatClientInstance);
        const chatchannel = chatClientInstance.channel(
          "messaging",
          session.callId
        );
        await chatchannel.watch();
        setChannel(chatchannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };
    if (session && !loadingsesssion) initcall();
    return () => {
      // iife
      (async () => {
        try {
          if (videocall) await videocall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamclient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, isHost, isParticipant, loadingsesssion]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
