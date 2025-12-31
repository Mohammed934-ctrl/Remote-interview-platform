import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";
import { StreamClient } from "@stream-io/node-sdk";

const Streamapikey = ENV.STREAM_API_KEY;
const Streamsecretkey = ENV.STREAM_API_SECRETKEY;

if (!Streamapikey || !Streamsecretkey) {
  console.error("Stream api key or stream secret key is missing");
}

//this is for chat usage
export const ChatClient = StreamChat.getInstance(Streamapikey, Streamsecretkey);
export const newStreamClient= new StreamClient(Streamapikey,Streamsecretkey)

export const Createandupdatestreamuser = async (Userdata) => {
  try {
    await ChatClient.upsertUser(Userdata);
    console.log("Stream user upserted successfully:", Userdata);
  } catch (error) {
    console.error("Error while upserting stream user", error);
  }
};
export const deletestreamuser = async (Userid) => {
  try {
    await ChatClient.deleteUser(Userid);
    console.log("Stream user deleted successfully:", Userid);
  } catch (error) {
    console.error("Error while deleting stream user", error);
  }
};
