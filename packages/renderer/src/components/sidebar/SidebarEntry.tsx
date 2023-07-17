import { RiArrowDropDownLine } from "react-icons/ri";
import { Folder } from "../../util/context";
import { shortenString } from "../../util/helpers";
import File from "./File";

function SidebarEntry({
  folder,
  openFolders,
  setOpenFolders,
}: {
  folder: Folder;
  openFolders: Array<string>;
  setOpenFolders: Function;
}) {
  return (
    <li className="w-48 flex flex-col justify-between items-start">
      <div className="flex items-center justify-start w-full">
        {shortenString(folder.name, 20)}
        <RiArrowDropDownLine
          className={`h-7 w-7 ${
            openFolders.includes(folder.path) && "transform rotate-180"
          } dark:text-gray-200 dark:hover:text-white transition-transform absolute right-0`}
          onClick={() => {
            if (openFolders.includes(folder.path)) {
              setOpenFolders(openFolders.filter((path: string) => path !== folder.path));
            } else {
              setOpenFolders([...openFolders, folder.path]);
            }
          }}
        />
      </div>
      <div
        className={`flex flex-col items-center ${
          openFolders.includes(folder.path) ? "block" : "hidden"
        }`}
      >
        <ul className="ml-4">
          {folder.subfolders?.map((subfolder, i) => (
            <SidebarEntry
              key={i}
              folder={subfolder}
              openFolders={openFolders}
              setOpenFolders={setOpenFolders}
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
