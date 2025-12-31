import React from "react";
import { getdifficultbybadge } from "../lib/utils.js";

const ProblemDescription = ({
  problem,
  currentproblemid,
  allproblems,
  onproblemchange,
}) => {
  return (
    <div className="h-full overflow-y-auto bg-base-200 ">
      <div className="p-6  bg-base-100 border-b border-base-200 rounded-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-base-content font-bold">
            {problem.title}
          </h1>
          <span className={`badge ${getdifficultbybadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-base-content/50 mt-2">{problem.category}</p>
        <div className="mt-4">
          <select  value={currentproblemid} onChange={(e)=>onproblemchange(e.target.value)}
          className="select select-sm  w-full font-bold text-base-content/85">
            {allproblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-base-100 border border-base-200 rounded-xl p-6 space-y-5">
        <h1 className="font-bold text-base-content text-xl">Description</h1>
        <div className="space-y-3 text-base leading-relaxed">
          <p className="text-base-content/90">{problem.description.text}</p>
          {problem.description.notes.map((note, id) => (
            <p key={id} className="text-base-content/90">
              {note}
            </p>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6 bg-base-100 border rounded-xl border-base-200">
        <h1 className="font-bold text-base-content text-xl">Examples</h1>
        <div className="space-y-4">
          {problem.examples.map((example, id) => (
            <div key={id}>
              <div className="flex items-center gap-3 mb-2">
                <span className="badge badge-sm">{id + 1}</span>
                <p className="font-semibold text-base-content">
                  {" "}
                  Example {id + 1}
                </p>
              </div>

              <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-primary font-bold min-w-[70]">
                    Input:
                  </span>
                  <span>{example.input}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold min-w-[70]">
                    Output:
                  </span>
                  <span>{example.output}</span>
                </div>
                {example.explanation && (
                  <div className="pt-2 border-t border-base-300 mt-2">
                    <span className="text-base-content/60 font-sans text-xs">
                      <span className="font-semibold">Explanation:</span>{" "}
                      {example.explanation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>



    

      <div className="p-6 space-y-6 bg-base-100 border rounded-xl border-base-200">
        <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
        <ul className="space-y-2 text-base-content/90">
         {
            problem.constraints.map((cons,id)=>(
                <li key={id} className="flex gap-2">
                <span className="text-primary text-xl">•</span>
                <code className="text-md">{cons}</code>
                </li>
            ))
         }

        </ul>


      </div>
    </div>
  );
};

export default ProblemDescription;
