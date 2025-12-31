import { StreamVideoClient } from "@stream-io/video-react-sdk";

const streamapikey = import.meta.env.VITE_STREAM_API;

let client = null;
export const initializeStreamClient = async (user, token) => {
  if (!streamapikey) throw new Error("Stream API key is not provided.");
  if (client && client?.user?.id === user.id) return client;
  //if client exist but user is different then diconnect old user first then create new one//
  if (client) {
    await disconnectStreamclient();
  }

  client = new StreamVideoClient({
    apiKey: streamapikey,
    user,
    token,
  });
  return client;
};

export const disconnectStreamclient = async () => {
  if (client) {
    try {
      await client.disconnectUser();
    } catch (error) {
      console.error("Error disconnecting Stream client:", error);
    }
  }
};
