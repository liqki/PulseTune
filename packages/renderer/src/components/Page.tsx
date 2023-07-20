import Playbar from "./Playbar";
import Settings from "./Settings";
import Sidebar from "./sidebar/Sidebar";

function Page() {
  return (
    <div className="h-[calc(100vh-28px)] w-screen bg-[#fcfcfc] dark:bg-[#1b1c26] text-black dark:text-white select-none">
      <Sidebar />
      <Settings />
      {/* <button
        onClick={() => reconnectDiscordRPC()}
        className="text-3xl absolute top-100 left-100"
      >
        PLS WORK
      </button> */}
      <Playbar />
    </div>
  );
}

export default Page;
