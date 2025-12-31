import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problem.js";

const CreateSession = ({
  isopen,
  roomConfig,
  setroomConfig,
  onCreateRoom,
  isCreating,
  onClose,
}) => {
  const problems = Object.values(PROBLEMS);
  if (!isopen) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedproblem = problems.find(
                  (p) => p.title === e.target.value
                );
                setroomConfig({
                  problem: e.target.value,
                  difficulty: selectedproblem.difficulty,
                });
              }}
            >
              <option value="" disabled>
                {" "}
                Choose a coding problem...{" "}
              </option>
              {problems.map((problem) => (
                <option value={problem.title} key={problem.id}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>
          {/* ROOM SUMMARY */}

          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />

              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem:{" "}
                  <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants:{" "}
                  <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button onClick={onClose} className="btn btn-ghost ">
              cancel
            </button>

            <button
              className="btn btn-primary gap-2"
              onClick={onCreateRoom}
              disabled={isCreating || !roomConfig.problem}
            >
              {isCreating ? (
                <LoaderIcon className="animate-spin size-4" />
              ) : (
                <PlusIcon className="size-5" />
              )}

              {isCreating? "Creating...":"Create"}
            </button>
          </div>
        </div>

      </div>

      <div  onClick={onClose}
      className="modal-backdrop"></div>
      
    </div>
  );
};

export default CreateSession;
