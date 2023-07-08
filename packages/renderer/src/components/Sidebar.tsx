import { handleFolderDialog, readFiles } from "#preload";
import { useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { Folder, useFavorites, useFolders, useNowPlaying } from "../util/context";
import SidebarEntry from "./SidebarEntry";

function Sidebar() {
  const { setPath } = useNowPlaying();
  const { folders, setFolders } = useFolders();
  const { favorites } = useFavorites();
  const [openFolder, setOpenFolder] = useState<string>("");

  const addFolder = async () => {
    const folder = await handleFolderDialog();
    if (!folder) return;
    const obj: Folder = { path: folder, name: folder.replace(/^.*[\\\/]/, ""), files: [] };
    if (folders.find(folder => folder.path === obj.path)) return;
    readFiles(folder).then(files => (obj.files = files));
    setFolders([...folders, obj]);
  };

  const removeFolder = (path: string) => {
    setFolders(folders.filter(folder => folder.path !== path));
  };

  return (
    <div className="h-full w-45 fixed left-0 bg-[#fcfcfc] dark:bg-[#1b1c26] overflow-y-scroll scrollbar-hide flex flex-col justify-start items-start">
      <button
        onClick={() => addFolder()}
        className="w-full flex justify-center items-center"
      >
        <AiFillFolderAdd className="h-10 w-10 dark:text-gray-200 dark:hover:text-white transform transition-transform hover:scale-105" />
      </button>
      <ul className="ml-2 mt-2">
        <SidebarEntry
          folder={{ path: "favorites", name: "Favorites", files: favorites }}
          openFolder={openFolder}
          setOpenFolder={setOpenFolder}
          setPath={setPath}
        />
        {folders.map((folder, i) => (
          <SidebarEntry
            key={i}
            folder={folder}
            openFolder={openFolder}
            setOpenFolder={setOpenFolder}
            setPath={setPath}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
