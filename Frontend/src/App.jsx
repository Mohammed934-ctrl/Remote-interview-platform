import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react';

import './App.css'

function App() {
  

  return (
    <>
      <h1>welcome to my app  login here</h1>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    <SignedIn>
      <SignOutButton/>
    </SignedIn>

  <UserButton/>
      
    </>
  )
}

export default App
