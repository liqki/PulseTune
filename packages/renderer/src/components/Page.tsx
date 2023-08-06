import Playbar from "./Playbar";
import Settings from "./Settings";
import SongDisplay from "./songdisplay/SongDisplay";
import Sidebar from "./sidebar/Sidebar";

function Page() {
  return (
    <div className="h-[calc(100vh-28px)] w-screen bg-[#fcfcfc] dark:bg-[#1b1c26] text-black dark:text-white select-none overflow-hidden">
      <Sidebar />
      <Settings />
      <SongDisplay />
      <Playbar />
    </div>
  );
}

export default Page;
