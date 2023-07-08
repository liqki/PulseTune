import { RiArrowDropDownLine } from "react-icons/ri";
import { Folder, useNowPlaying } from "../util/context";
import { shortenString } from "../util/helpers";

function SidebarEntry({
  folder,
  openFolder,
  setOpenFolder,
  setPath,
}: {
  folder: Folder;
  openFolder: string;
  setOpenFolder: Function;
  setPath: Function;
}) {
  const { path } = useNowPlaying();

  const isCurrentSong = (folder: Folder, file: string) => {
    if (folder.path === "favorites") {
      return file === path;
    }
    return folder.path + "\\" + file === path;
  };

  return (
    <li className="w-43 flex flex-col justify-between items-start">
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
              className={`flex items-center justify-between ${
                isCurrentSong(folder, file) && "text-blue-500"
              }`}
              onClick={() => {
                if (folder.path === "favorites") {
                  setPath(file);
                  return;
                }
                setPath(folder.path + "\\" + file);
              }}
            >
              {shortenString(file.split("-")[1].slice(0, -4), 20)}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default SidebarEntry;
