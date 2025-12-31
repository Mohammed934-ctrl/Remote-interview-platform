import React from "react";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";

import { SignInButton } from "@clerk/clerk-react";

const Home = () => {
  return (
    <div className="bg-linear-to-br from-base-100 via-base-200 to-base-300 ">
      {/* NAVBAR */}

      <nav className="top-0 z-50 sticky bg-base-100/80  backdrop-blur-md border-b border-primary/20 shadow-lg">
        <div className="max-w-7xl flex items-center justify-between mx-auto p-5">
          <Link
            to={"/"}
            className="flex  justify-center items-center gap-2  hover:scale-105 transition-transform  duration-200"
          >
            <div className="size-11 rounded-xl bg-linear-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <SparklesIcon className="text-white size-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                Talent IQ
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">
                Code Together
              </span>
            </div>
          </Link>

          <SignInButton mode="modal">
            <button className="group px-6 py-3 bg-linear-to-r from-primary to-secondary rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2  cursor-pointer ">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform " />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* NEW SECTION */}
      <div className="max-w-7xl mx-auto py-15 px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/*Left SECTION */}
          <div className="space-y-8">
            <div className="flex gap-2 badge badge-secondary badge-lg ">
              <ZapIcon className="size-5" />
              Real-time Collaboration
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text  text-transparent">
                Code Together,
              </span>
              <br />
              <span className="text-base-content">Learn Together</span>
            </h1>

            <p className="text-base-content leading-relaxed text-xl max-w-xl ">
              The ultimate platform for collaborative coding interviews and pair
              programming. Connect face-to-face, code in real-time, and ace your
              technical interviews.
            </p>

            <div className="flex gap-3 flex-wrap">
              <h4 className="badge badge-lg badge-outline">
                <CheckIcon className="size-5 text-success" />
                Live Video Chat
              </h4>
              <h4 className="badge badge-lg badge-outline ">
                <CheckIcon className="size-5 text-success" />
                Code Editor
              </h4>
              <h4 className="badge badge-lg badge-outline">
                <CheckIcon className="size-5 text-success" />
                Multi-Language
              </h4>
            </div>

            <div className=" flex  items-center gap-3">
              <SignInButton mode="modal">
                <button className=" btn btn-primary btn-lg ">
                  Start Now
                  <ArrowRightIcon className="size-4" />
                </button>
              </SignInButton>

              <div className="btn btn-outline">
                <VideoIcon className="size-4" />
                Watch Demo
              </div>
            </div>

            {/*Stats*/}

            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary">10k+</div>
                <div className="stat-title">Active User</div>
              </div>
              <div className="stat">
                <div className="stat-value text-primary">50k+</div>
                <div className="stat-title">Sessions</div>
              </div>
              <div className="stat">
                <div className="stat-value text-primary">99.9%</div>
                <div className="stat-title">Uptime</div>
              </div>
            </div>
          </div>
          <img
            src="/hero.png"
            alt="coding image"
            className="w-full h-auto rounded-xl  hover:scale-110 transition-transform duration-400  "
          />
        </div>
        {/* IMAGE */}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to  {" "}
            <span className="text-primary font-bold">Succeed</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Powerful features designed to make your coding interviews seamless
            and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 font-sans">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div
                className="bg-primary/10 rounded-2xl size-16 flex items-center justify-center
               "
              >
                <VideoIcon className="size-10 text-primary" />
              </div>
              <h3 className="card-title">HD Video Call</h3>
              <p className="text-base-content/70 ">
                Crystal clear video and audio for seamless communication during
                interviews
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Live Code Editor</h3>
              <p className="text-base-content/70">
                Collaborate in real-time with syntax highlighting and multiple
                language support
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">Easy Collaboration</h3>
              <p className="text-base-content/70">
                Share your screen, discuss solutions, and learn from each other
                in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
