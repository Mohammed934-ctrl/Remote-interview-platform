import { Inngest } from "inngest";
import { connectionDB } from "./DB.js";
import User from "../Models/User.schema.js";
import { Createandupdatestreamuser, deletestreamuser } from "./Stream.js";

export const inngest = new Inngest({ id: "Remote-interview" });

const syncuser = inngest.createFunction(
  
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectionDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await Createandupdatestreamuser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteuser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectionDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
    await deletestreamuser(id.toString());
  }
);

export const functions = [syncuser, deleteuser];
