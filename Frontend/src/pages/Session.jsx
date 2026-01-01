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
import { executecode } from "../lib/piston.js";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { getdifficultbybadge } from "../lib/utils.js";
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";

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

  const session = Sessiondata?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const { streamClient, call, chatClient, channel, isInitializingCall } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  // finding the problem deatils data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [code, setcode] = useState(
    problemData?.starterCode?.[selectedlanguage] || ""
  );

  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "Completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedlanguage]) {
      setcode(problemData.starterCode[selectedlanguage]);
    }
  }, [problemData, selectedlanguage]);

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, isHost, isParticipant, loadingSession, user, id]);

  const handlelanguagechange = (e) => {
    const newlang = e.target.value;
    setselectedlanguage(newlang);
    const starterCode = problemData?.starterCode?.[newlang] || "";
    setcode(starterCode);
    setoutput(null);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified."
      )
    ) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    return String(output ?? "")
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualoutput, expectedoutput) => {
    const normalizeactualoutput = normalizeOutput(actualoutput);
    const normalizeexpectedoutput = normalizeOutput(expectedoutput);
    return normalizeactualoutput == normalizeexpectedoutput;
  };

  const handleruncode = async () => {
    setisRunning(true);
    setoutput(null)

    const result = await executecode(selectedlanguage, code);
    setoutput(result);
    setisRunning(false);
    if (result.success) {
      const expectedoutput = problemData?.expectedOutput[selectedlanguage];
      const testpassed = checkIfTestsPassed(expectedoutput, result.output);
      if (testpassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                <div className="h-screen overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-base-100  border border-base-300">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-base-content">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base-content/60 mt-1">
                            {problemData.category}
                          </p>
                        )}
                        <p className="text-base-content/60 mt-2">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span
                          className={`badge badge-lg ${getdifficultbybadge(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty || "Easy"}
                        </span>
                        {isHost && session?.status === "Active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "Completed" && (
                          <span className="badge badge-ghost badge-lg">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                        <h2 className="text-xl font-bold mb-4 text-base-content">
                          Description
                        </h2>
                        <div className="space-y-3 text-base leading-relaxed">
                          <p className="text-base-content/90">
                            {problemData.description.text}
                          </p>
                          {problemData.description.notes?.map((note, id) => (
                            <p key={id} className="text-base-content/90">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* examples section */}

                    {problemData?.examples &&
                      problemData.examples.length > 0 && (
                        <div className="bg-base-100 rounded-xl  shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">
                            Examples
                          </h2>

                          <div className="space-y-4 ">
                            {problemData.examples.map((example, id) => (
                              <div key={id}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="badge badge-sm">
                                    {id + 1}
                                  </span>
                                  <p className="font-semibold text-base-content">
                                    Example {id + 1}
                                  </p>
                                </div>

                                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                  <div className="flex gap-2">
                                    <span className="text-primary font-bold min-w-17.5">
                                      Input:
                                    </span>
                                    <span>{example.input}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-secondary font-bold min-w-17.5">
                                      Output:
                                    </span>
                                    <span>{example.output}</span>
                                  </div>
                                </div>

                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-2">
                                    <span className="text-base-content/60 font-sans text-xs">
                                      <span className="font-semibold">
                                        Explanation:
                                      </span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Constraints */}
                    {problemData?.constraints &&
                      problemData.constraints.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">
                            Constraints
                          </h2>
                          <ul className="space-y-2 text-base-content/90">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <code className="text-sm">{constraint}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />
              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditor
                      starterCode={code}
                      oncodechange={setcode}
                      selectedlanguage={selectedlanguage}
                      onlanguagechange={handlelanguagechange}
                      onRuncode={handleruncode}
                      isRunning={isRunning}
                    />
                  </Panel>

                  <Panel defaultSize={30} minSize={20}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
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
