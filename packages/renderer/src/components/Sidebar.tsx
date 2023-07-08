import { handleFolderDialog, readFiles } from "#preload";
import { useState } from "react";
import { AiFillFolderAdd } from "react-icons/ai";
import { shortenString } from "../util/helpers";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Folder, useFolders, useNowPlaying } from "../util/context";

function Sidebar() {
  const { setPath } = useNowPlaying();
  const { folders, setFolders } = useFolders();
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
        {folders.map((folder, i) => (
          <li
            key={i}
            className="w-43 flex flex-col justify-between items-start"
          >
            <div className="flex items-center justify-between w-full">
              {shortenString(folder.name, 20)}
              <RiArrowDropDownLine
                className={`h-7 w-7 ${
                  openFolder === folder.path && "transform rotate-180"
                } dark:text-gray-200 dark:hover:text-white transition-transform ml-auto`}
                onClick={() => {
                  if (openFolder === folder.path) {
                    setOpenFolder("");
                  } else {
                    setOpenFolder(folder.path);
                  }
                }}
              />
            </div>
            <div
              className={`flex flex-col items-center ml-4 ${
                openFolder === folder.path ? "block" : "hidden"
              }`}
            >
              <ul>
                {folder.files?.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between"
                    onClick={() => setPath(folder.path + "\\" + file)}
                  >
                    {shortenString(file.split("-")[1].slice(0, -4), 20)}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
