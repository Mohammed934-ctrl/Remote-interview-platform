import React, { useState } from "react";
import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import StatsCards from "../components/StatsCards";
import ActiveSession from "../components/ActiveSession.jsx";
import RecentSession from "../components/RecentSession.jsx";
import CreateSession from "../components/CreateSession.jsx";
import {
  useActiveSession,
  useCreateSession,
  useRecentSession,
} from "../hooks/useSession.js";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setshowCreateModal] = useState(false);
  const [roomCongfig, setroomCongfig] = useState({
    problem: "",
    difficulty: "",
  });

  const CreateSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } =
    useActiveSession();

  const { data: recentSessionsData, isLoading: loadingRecentSessions } =
    useRecentSession();

  const activeSession = activeSessionsData?.sessions || [];
  const recentSession = recentSessionsData?.sessions || [];
  const handleCreateRoom = () => {
    if (!roomCongfig.problem || !roomCongfig.difficulty) return;
    if (CreateSessionMutation.isPending) return;

    CreateSessionMutation.mutate(
      {
        problem: roomCongfig.problem,
        difficulty: roomCongfig.difficulty,
      },
      {
        onSuccess: (data) => {
          toast.success("Session created successfully!");

          setshowCreateModal(false);
          navigate(`/session/${data.sessions._id}`);
        },
      }
    );
  };

  const isUserInSession = (session) => {
    if (!user.id) return false;
    return (
      session.host?.clerkId === user.id ||
      session.participant?.clerkId === user.id
    );
  };
  return (
    <>
      <div className="h-min-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setshowCreateModal(true)} />

        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessioncount={activeSession.length}
              recentSessioncount={recentSession.length}
            />
            <ActiveSession
              sessions={activeSession}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>
          <RecentSession
            sessions={recentSession}
            isLoading={loadingRecentSessions}
          />
        </div>
      </div>

      <CreateSession
        isopen={showCreateModal}
        onClose={() => setshowCreateModal(false)}
        roomConfig={roomCongfig}
        setroomConfig={setroomCongfig}
        onCreateRoom={handleCreateRoom}
        isCreating={CreateSessionMutation.isPending}
      />
    </>
  );
};

export default Dashboard;