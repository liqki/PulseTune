import { useEffect, useRef, useState } from "react";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFillSkipStartCircleFill,
  BsFillSkipEndCircleFill,
  BsFillHeartFill,
  BsHeart,
} from "react-icons/bs";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { shortenString } from "../util/helpers";
import { useFavorites, useFolders, useNowPlaying } from "../util/context";
import Timeline from "./Timeline";
import VolumeSlider from "./VolumeSlider";
import { getAlbumArt, updateRichPresence } from "#preload";

function Playbar() {
  type Song = {
    artist: string;
    title: string;
  };

  const { path, setPath } = useNowPlaying();
  const { folders } = useFolders();
  const { favorites, setFavorites } = useFavorites();
  const [song, setSong] = useState<Song>({
    artist: "",
    title: "",
  });
  const [playing, setPlaying] = useState<boolean>(false);
  const [player, setPlayer] = useState<HTMLAudioElement | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [newTime, setNewTime] = useState<number>(0);
  const [albumArtUrl, setAlbumArtUrl] = useState<string>("");
  const [volume, setVolume] = useState<number>(0.1);
  const [displayVolume, setDisplayVolume] = useState<boolean>(false);

  const pathLoad = useRef(true);
  const rpcLoad = useRef(true);

  const checkFavorite = () => {
    if (path.startsWith("File:///")) {
      if (favorites.includes(path)) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } else {
      if (favorites.includes("File:///" + path.replace(/\\/g, "/"))) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  };

  useEffect(() => {
    setPlayer(new Audio());
    setVolume(localStorage.getItem("volume") ? parseFloat(localStorage.getItem("volume")!) : 0.1);
  }, []);

  useEffect(() => {
    if (path === undefined || path === "" || !player) return;
    setPlaying(false);
    const fileName = path.replace(/^.*[\\\/]/, "");
    if (fileName === "" || fileName === undefined) return;
    const artist = fileName.split(" - ")[0];
    const title = fileName.split(" - ")[1]?.split(".")[0];
    setSong({ artist, title });
    checkFavorite();
    player.src = path;
    if (pathLoad.current) {
      pathLoad.current = false;
      return;
    }
    setTimeout(() => {
      setPlaying(true);
    }, 10);
  }, [path]);

  useEffect(() => {
    if (song.artist === "" || song.title === "" || !player) return;
    getAlbumArt(song).then((url: string) => {
      setAlbumArtUrl(url);
      if (rpcLoad.current) {
        rpcLoad.current = false;
        return;
      }
      updateRichPresence({
        details: song.title + " - " + song.artist,
        startTimestamp: Date.now(),
        endTimestamp: Date.now() + player.duration * 1000,
        largeImageKey: url,
      });
    });
  }, [song]);

  useEffect(() => {
    if (!player) return;
    player.volume = volume;
  }, [player]);

  useEffect(() => {
    if (!player) return;
    player.volume = volume;
    if (volume > 0) localStorage.setItem("volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    if (!player) return;
    playing ? player.play() : player.pause();
    if (playing) {
      updateRichPresence({
        details: song.title + " - " + song.artist,
        startTimestamp: Date.now(),
        endTimestamp: Date.now() + player.duration * 1000 - currentTime * 1000,
        largeImageKey: albumArtUrl,
      });
      player.ontimeupdate = () => {
        setCurrentTime(player.currentTime);
      };
    } else {
      player.ontimeupdate = null;
      setCurrentTime(player.currentTime);
      updateRichPresence({
        details: song.title + " - " + song.artist,
        startTimestamp: 0,
        endTimestamp: 0,
        largeImageKey: albumArtUrl,
      });
    }
  }, [playing]);

  useEffect(() => {
    if (!player) return;
    player.currentTime = newTime;
    updateRichPresence({
      details: song.title + " - " + song.artist,
      startTimestamp: Date.now(),
      endTimestamp: Date.now() + player.duration * 1000 - newTime * 1000,
      largeImageKey: albumArtUrl,
    });
  }, [newTime]);

  useEffect(() => {
    if (!player) return;
    if (currentTime >= player.duration) {
      skip(1);
      setCurrentTime(0);
    }
  }, [currentTime]);

  useEffect(() => {
    checkFavorite();
  }, [favorites]);

  const skip = (direction: number) => {
    if (!player || path === "") return;
    // is favorite
    if (path.startsWith("File:///")) {
      if (favorites.length === 1) return;
      const currentIndex = favorites.findIndex(favorite => favorite === path);
      let nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = favorites.length - 1;
      if (nextIndex > favorites.length - 1) nextIndex = 0;
      setPlaying(false);
      setPath(favorites[nextIndex]);
    } else {
      const folder =
        folders[
          folders.findIndex(folder => folder.path === path.substring(0, path.lastIndexOf("\\")))
        ];
      if (!folder) return;
      if (!("files" in folder) || folder.files === undefined) return;
      if (folder.files.length === 1) return;
      const currentIndex = folder.files.findIndex(
        file => file === path.substring(path.lastIndexOf("\\") + 1),
      );
      let nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = folder.files.length - 1;
      if (nextIndex > folder.files.length - 1) nextIndex = 0;
      setPlaying(false);
      setPath(folder.path + "\\" + folder.files[nextIndex]);
    }
  };

  const addFavorite = () => {
    if (path.startsWith("File:///")) {
      setFavorites([...favorites, path]);
      return;
    }
    setFavorites([...favorites, "File:///" + path.replace(/\\/g, "/")]);
  };

  const removeFavorite = () => {
    if (path.startsWith("File:///")) {
      setPath(path.substring(8).replaceAll("/", "\\"));
      return setFavorites(favorites.filter(favorite => favorite !== path));
    }
    setFavorites(favorites.filter(favorite => favorite !== "File:///" + path.replace(/\\/g, "/")));
  };

  return (
    <div className="w-screen h-20 bg-[#fcfcfc] dark:bg-[#1b1c26] fixed bottom-0 left-0">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center w-50">
          {albumArtUrl !== "" && (
            <img
              src={albumArtUrl}
              className="w-12 h-12 bg-black rounded-full"
              onDragStart={e => {
                e.preventDefault();
              }}
            />
          )}
          <div className="ml-4">
            <h1 className="text-lg font-semibold">{shortenString(song.title, 15)}</h1>
            <h2 className="text-sm">{shortenString(song.artist, 20)}</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
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
          <Timeline
            player={player}
            currentTime={currentTime}
            setNewTime={setNewTime}
          />
        </div>
        <div className="flex items-center justify-end gap-4 w-50">
          {isFavorite ? (
            <BsFillHeartFill
              className="w-7 h-7 dark:text-gray-200 dark:hover:text-white"
              onClick={() => removeFavorite()}
            />
          ) : (
            <BsHeart
              className={`w-7 h-7 dark:text-gray-200 dark:hover:text-white ${
                song.title === "" && "hidden"
              }`}
              onClick={() => addFavorite()}
            />
          )}
          {volume > 0 ? (
            <MdVolumeUp
              className="w-7 h-7 dark:text-gray-200 dark:hover:text-white"
              onClick={() => {
                if (displayVolume) return setVolume(0);
                setDisplayVolume(true);
              }}
            />
          ) : (
            <MdVolumeOff
              className="w-7 h-7 dark:text-gray-200 dark:hover:text-white"
              onClick={() => {
                if (displayVolume) return setVolume(parseFloat(localStorage.getItem("volume")!));
                setDisplayVolume(true);
              }}
            />
          )}
          <div
            className={`${displayVolume ? "block" : "hidden"} absolute bottom-22 -right-2`}
            onMouseLeave={() => setDisplayVolume(false)}
          >
            <VolumeSlider
              volume={volume}
              setVolume={setVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playbar;
