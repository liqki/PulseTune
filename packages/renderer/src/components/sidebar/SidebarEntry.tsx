import { RiArrowDropDownLine, RiDeleteBin6Line } from "react-icons/ri";
import { Folder, useFolders } from "../../util/context";
import { shortenString } from "../../util/helpers";
import File from "./File";
import { useState } from "react";

function SidebarEntry({
  folder,
  openFolders,
  setOpenFolders,
  removeFolder,
}: {
  folder: Folder;
  openFolders: Array<string>;
  setOpenFolders: Function;
  removeFolder: Function;
}) {
  const { folders } = useFolders();

  const [showDelete, setShowDelete] = useState<{ show: boolean; x: number }>({
    show: false,
    x: 0,
  });

  return (
    <li className="w-full flex flex-col justify-between items-start">
      <div
        className="flex items-center w-full justify-between"
        onContextMenu={e => {
          if (folder.path === "favorites") return;
          if (!folders.find(f => f.path === folder.path)) return;
          if (showDelete.show) return setShowDelete({ show: false, x: 0 });
          setShowDelete({ show: true, x: e.clientX });
        }}
      >
        <p>{shortenString(folder.name, 20)}</p>
        <RiArrowDropDownLine
          className={`h-7 w-7 ${
            openFolders.includes(folder.path) && "transform rotate-180"
          } dark:text-gray-200 dark:hover:text-white transition-transform`}
          onClick={() => {
            if (openFolders.includes(folder.path)) {
              setOpenFolders(openFolders.filter((path: string) => path !== folder.path));
            } else {
              setOpenFolders([...openFolders, folder.path]);
            }
          }}
        />
        <RiDeleteBin6Line
          className={`${!showDelete.show && "hidden"} absolute text-lg text-red-400`}
          style={{ left: showDelete.x }}
          onMouseLeave={() => setShowDelete({ show: false, x: 0 })}
          onClick={() => removeFolder(folder.path)}
        />
      </div>
      <div
        className={`flex flex-col items-center w-full ${
          openFolders.includes(folder.path) ? "block" : "hidden"
        }`}
      >
        <ul className="ml-4 w-[calc(100%-16px)]">
          {folder.subfolders?.map((subfolder, i) => (
            <SidebarEntry
              key={i}
              folder={subfolder}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
              removeFolder={removeFolder}
            />
          ))}
          {folder.files?.map((file, i) => (
            <File
              key={i}
              folder={folder}
              file={file}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

export default SidebarEntry;
