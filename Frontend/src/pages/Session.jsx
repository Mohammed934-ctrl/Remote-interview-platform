import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar.jsx";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSession.js";
import { PROBLEMS } from "../data/problem";
import useStreamClient from "../hooks/useStreamClient.js";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideocallUi from "../components/VideocallUi.jsx";

const Session = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { id } = useParams();
  const [output, setoutput] = useState(null);
  const [isRunning, setisRunning] = useState(false);
  const [selectedlanguage, setselectedlanguage] = useState("javascript");

  const {
    data: Sessiondata,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);

  const session = Sessiondata?.sessions;
  const isHost = session?.host?.clerkId === user.id;
  const isParticipant = session?.participant?.clerkId === user.id;

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const { streamClient, call, chatClient, channel, isInitializingCall } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  // finding the problem deatils data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  // const [code, setcode] = useState(
  //   problemData.starterCode[selectedlanguage || ""]
  // );
  


  

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, isHost, isParticipant, loadingSession, user, id]);
  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            codesection
          </Panel>
          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />
          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4  overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">
                        Unable to connect to the video call
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideocallUi chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default Session;
