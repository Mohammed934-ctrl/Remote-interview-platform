import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

import "./App.css";

function App() {
  return (
    <>
      <h1>welcome to my app login here</h1>
      <h1>
        welcome to my app Lorem ipsum dolor sit amet consectetur adipisicing
        elit.
      </h1>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>

      <UserButton />
    </>
  );
}

export default App;
