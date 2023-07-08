import { useEffect, useState } from "react";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFillSkipStartCircleFill,
  BsFillSkipEndCircleFill,
  BsFillHeartFill,
  BsHeart,
} from "react-icons/bs";
import { shortenString } from "../util/helpers";
import { useFolders, useNowPlaying } from "../util/context";

function Playbar() {
  type Song = {
    artist: string;
    title: string;
    isFavorite?: boolean;
  };

  const { path, setPath } = useNowPlaying();
  const { folders } = useFolders();
  const [song, setSong] = useState<Song>({
    artist: "",
    title: "",
  });
  const [playing, setPlaying] = useState<boolean>(false);
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setPlayer(new Audio());
  }, []);

  useEffect(() => {
    if (path === "" || !player) return;
    const fileName = path.replace(/^.*[\\\/]/, "");
    const artist = fileName.split(" - ")[0];
    const title = fileName.split(" - ")[1].split(".")[0];
    setSong({ artist, title });
    player.src = path;
    setPlaying(true);
  }, [path]);

  useEffect(() => {
    if (!player) return;
    player.volume = 0.1;
    if (path !== "") setPlaying(true);
  }, [player]);

  useEffect(() => {
    if (!player) return;
    playing ? player.play() : player.pause();
  }, [playing]);

  const skip = (direction: number) => {
    if (!player) return;
    const folder =
      folders[
        folders.findIndex(folder => folder.path === path.substring(0, path.lastIndexOf("\\")))
      ];
    if (!folder.files) return;
    const currentIndex = folder.files.findIndex(
      file => file === path.substring(path.lastIndexOf("\\") + 1),
    );
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = folder.files.length - 1;
    if (nextIndex > folder.files.length - 1) nextIndex = 0;
    setPlaying(false);
    setPath(folder.path + "\\" + folder.files[nextIndex]);
  };

  return (
    <div className="w-screen h-20 bg-[#fcfcfc] dark:bg-[#1b1c26] fixed bottom-0 left-0">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center w-50">
          {song.title !== "" && <div className="w-12 h-12 bg-black rounded-full"></div>}
          <div className="ml-4">
            <h1 className="text-lg font-semibold">{shortenString(song.title, 15)}</h1>
            <h2 className="text-sm">{shortenString(song.artist, 20)}</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <BsFillSkipStartCircleFill
            className="w-9 h-9 dark:text-gray-200 dark:hover:text-white transform transition-transform hover:scale-105"
            onClick={() => {
              if (!player) return;
              player.currentTime > 5 ? (player.currentTime = 0) : skip(-1);
            }}
          />
          {!playing ? (
            <BsFillPlayCircleFill
              className="w-10 h-10 transform hover:scale-105 transition-transform"
              onClick={() => {
                song.title !== "" && setPlaying(true);
              }}
            />
          ) : (
            <BsFillPauseCircleFill
              className="w-10 h-10 transform hover:scale-105 transition-transform"
              onClick={() => {
                setPlaying(false);
              }}
            />
          )}
          <BsFillSkipEndCircleFill
            className="w-9 h-9 dark:text-gray-200 dark:hover:text-white transform transition-transform hover:scale-105"
            onClick={() => {
              skip(1);
            }}
          />
        </div>
        <div className="flex items-center justify-end w-50">
          {song.isFavorite ? (
            <BsFillHeartFill className="w-7 h-7 dark:text-gray-200 dark:hover:text-white" />
          ) : (
            <BsHeart
              className={`w-7 h-7 dark:text-gray-200 dark:hover:text-white ${
                song.title === "" && "hidden"
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Playbar;
