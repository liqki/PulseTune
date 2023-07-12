import { RiArrowDropDownLine } from "react-icons/ri";
import { Folder, useNowPlaying } from "../util/context";
import { shortenString } from "../util/helpers";

function SidebarEntry({
  folder,
  openFolders,
  setOpenFolders,
  setPath,
}: {
  folder: Folder;
  openFolders: Array<string>;
  setOpenFolders: Function;
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
            openFolders.includes(folder.path) && "transform rotate-180"
          } dark:text-gray-200 dark:hover:text-white transition-transform ml-auto`}
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
        className={`flex flex-col items-center ml-4 ${
          openFolders.includes(folder.path) ? "block" : "hidden"
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
