import { Inngest } from "inngest";
import { connectionDB } from "./DB.js";
import User from "../Models/User.schema.js";

export const inngest = new Inngest({ id: "Remote-interview" });

const syncuser = inngest.createFunction(
  {
    id: "sync-user",
  },
  { event: "clerk/user.created" },

  async ({ event }) => {
    await connectionDB();

    const { id, email_addresses, firstname, lastname, imageurl } = event.data;


    console.log("full event data =>", event.data)

    const newUser = {
      ClerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${firstname || ""} ${lastname || ""}  `,
      profileImage: imageurl,
    };
    await  User.create(newUser)
  }



);



const deleteuser = inngest.createFunction({id:"delete-user"},{event:"clerk/user.deleted"},
    async ({event})=>{

        await  connectionDB()
        const {id} = event.data;
        await User.deleteOne({ClerkId:id})

    }
)



export const functions=[syncuser,deleteuser]