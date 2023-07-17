import { Folder, useNowPlaying } from "/@/util/context";
import { shortenString } from "/@/util/helpers";

function File({ folder, file }: { folder: Folder; file: string }) {
  const { path, setPath } = useNowPlaying();

  const isCurrentSong = (folder: Folder, file: string) => {
    if (folder.path === "favorites") {
      return file === path;
    }
    return folder.path + "\\" + file === path;
  };

  return (
    <li
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
  );
}

export default File;
