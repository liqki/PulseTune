import Playbar from "./Playbar";
import Sidebar from "./Sidebar";

function Page() {
  return (
    <div className="h-[calc(100vh-40px)] w-screen bg-[#fcfcfc] dark:bg-[#1b1c26] text-black dark:text-white select-none">
      <Sidebar />
      <Playbar />
    </div>
  );
}

export default Page;
