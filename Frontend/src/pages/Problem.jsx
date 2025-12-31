import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problem.js";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import { executecode } from "../lib/piston.js";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentproblemid, setcurrentproblemid] = useState("two-sum");
  const [selectedlanguage, setselectedlanguage] = useState("javascript");
  const [output, setoutput] = useState(null);

  const [isRunning, setisRunning] = useState(false);
  const [Statercode, setStatercode] = useState(
    PROBLEMS[currentproblemid].starterCode.javascript
  );

  const Currentproblem = PROBLEMS[currentproblemid];
  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setStatercode(PROBLEMS[id].starterCode[selectedlanguage]);
      setcurrentproblemid(id);
      setoutput(null);
    }
  }, [id, selectedlanguage]);

  const handlelanguagechange = (e) => {
    const newlang = e.target.value;
    setselectedlanguage(newlang);
    setStatercode(Currentproblem.starterCode[newlang]);
    setoutput(null);
  };
  

  const handleproblemchange = (newproblemid) =>
    navigate(`/problems/${newproblemid}`);

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

  const handleRunCode = async () => {
    setisRunning(true);
    setoutput(null);

    const result = await executecode(selectedlanguage, Statercode);
    setoutput(result);
    setisRunning(false);

    if (result.success) {
      const expectedoutput = Currentproblem.expectedOutput[selectedlanguage];
      const testspassed = checkIfTestsPassed(result.output, expectedoutput);
      if (testspassed) {
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
    <div className="h-screen bg-base-200 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* problem-description panel */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={Currentproblem}
              currentproblemid={currentproblemid}
              allproblems={Object.values(PROBLEMS)}
              onproblemchange={handleproblemchange}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={40}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={50}>
                <CodeEditor
                  selectedlanguage={selectedlanguage}
                  starterCode={Statercode}
                  onlanguagechange={handlelanguagechange}
                  isRunning={isRunning}
                  oncodechange={setStatercode}
                  onRuncode={handleRunCode}
                />
              </Panel>
              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

              <Panel defaultSize={30} minSize={20}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default Problem;
