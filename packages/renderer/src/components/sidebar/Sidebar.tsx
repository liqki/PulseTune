import { handleFolderDialog, readFiles, readFolders } from "#preload";
import { useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { Folder, useFavorites, useFolders, useNowPlaying } from "../../util/context";
import SidebarEntry from "./SidebarEntry";

function Sidebar() {
  const { folders, setFolders } = useFolders();
  const { favorites } = useFavorites();
  const [openFolders, setOpenFolders] = useState<Array<string>>([]);

  const addFolder = async () => {
    const folder = await handleFolderDialog();
    if (!folder) return;
    const obj: Folder = {
      path: folder,
      name: folder.replace(/^.*[\\\/]/, ""),
      files: [],
      subfolders: [],
    };
    if (folders.find(folder => folder.path === obj.path)) return;
    readFiles(folder).then(files => (obj.files = files));
    readFolders(folder).then(subfolders => (obj.subfolders = subfolders));
    setFolders([...folders, obj]);
  };

  const removeFolder = (path: string) => {
    setFolders(folders.filter(folder => folder.path !== path));
  };

  return (
    <div className="h-[calc(100%-120px)] w-50 fixed left-0 bg-[#fcfcfc] dark:bg-[#1b1c26] flex flex-col justify-start items-start">
      <div className="w-full flex justify-center items-center">
        <AiFillFolderAdd
          className="h-10 w-10 dark:text-gray-200 dark:hover:text-white transform transition-transform hover:scale-105 hover:cursor-pointer"
          onClick={() => addFolder()}
        />
      </div>
      <ul className="ml-2 mt-2 mr-2 h-full overflow-y-scroll scrollbar-hide">
        <SidebarEntry
          folder={{ path: "favorites", name: "Favorites", files: favorites }}
          openFolders={openFolders}
          setOpenFolders={setOpenFolders}
        />
        {folders.map((folder, i) => (
          <SidebarEntry
            key={i}
            folder={folder}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
