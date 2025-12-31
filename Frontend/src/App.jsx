import { useState } from "react";

import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";

import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard.jsx";
import Problems from "./pages/Problems.jsx";
import Problem from "./pages/Problem.jsx";
import Session from "./pages/Session.jsx";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <Home /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/problems"
          element={isSignedIn ? <Problems/>: <Navigate to={"/"} />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to={"/"} />}
        />
        <Route path="/problems/:id" element={isSignedIn ? <Problem/> : <Navigate to={"/"} />} />
        <Route path="/session/:id" element={isSignedIn ? <Session/> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
