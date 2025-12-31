import React from "react";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problem.js";
import { Code2Icon, ChevronRightIcon } from "lucide-react";
import { Link } from "react-router";
import { getdifficultbybadge } from "../lib/utils.js";

const Problems = () => {
  const problems = Object.values(PROBLEMS);

  const easyproblemcount=problems.filter((p)=>p.difficulty==="Easy").length;
   const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;


  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <div className="max-w-7xl mx-auto  px-10 py-15">
        <div className="mb-7">
          <h1 className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold text-3xl ">
            Practice problems
          </h1>
          <p className="text-base-content/60 text-xl">
            Sharpen your coding skills with these curated problems
          </p>
        </div>
        {/*Problem List */}
        <div className="space-y-5">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              className="card bg-base-200 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body">
                <div className="flex justify-between items-center gap-3 mb-1">
                  <div className="flex-1">
                    <div className="flex items-center  gap-3 mb-1">
                      <div className="size-12 flex justify-center items-center rounded-lg bg-primary/10">
                        <Code2Icon className="size-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold">{problem.title}</h2>
                          <span
                            className={`badge ${getdifficultbybadge(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        <p className="text-sm text-base-content/60">
                          {" "}
                          {problem.category}
                        </p>
                      </div>
                    </div>
                  </div>
                <div className="flex items-center gap-1 text-primary hover:bg-primary/70 hover:text-white rounded-xl p-3">
                  <span className="font-medium">Solve</span>
                  <ChevronRightIcon className="size-5" />
                </div>
              </div>
                <p className="text-base-content/80 mb-3">
                  {problem.description.text}
                </p>
                </div>

            </Link>
          ))}
        </div>

        {/*Stats */}


        <div className="card mt-12 bg-base-100 ">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
             <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Easy problems</div>
                <div className="stat-value text-success">{easyproblemcount}</div>

              </div>
              <div className="stat">
                <div className="stat-title">Medium problems</div>
                <div className="stat-value text-warning">{mediumProblemsCount}</div>

              </div>
              <div className="stat">
                <div className="stat-title">Hard problems</div>
                <div className="stat-value text-error">{hardProblemsCount}</div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Problems;
