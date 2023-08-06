import { getAlbumArt } from "#preload";
import { useEffect, useRef, useState } from "react";
import { useNowPlaying } from "/@/util/context";

function SongCard({ file }: { file: string }) {
  type Song = {
    artist: string;
    title: string;
  };

  const { path, setPath } = useNowPlaying();

  const [song, setSong] = useState<Song>({ artist: "", title: "" });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!file || file === "") return;
    const fileName = file.replace(/^.*[\\\/]/, "");
    const artist = fileName.split(" - ")[0];
    const title = fileName.split(" - ")[1]?.split(".")[0];
    setSong({ artist, title });
  }, [file]);

  useEffect(() => {
    getAlbumArt(song).then(art => {
      if (!art || !imgRef.current) return;
      imgRef.current.src = art;
    });
  }, [song]);

  return (
    <div
      className="h-45 w-40 relative cursor-pointer"
      onClick={() => {
        if (file === path) return;
        setPath(file);
      }}
    >
      <img
        className="h-full w-full rounded-md"
        ref={imgRef}
      />
      <div className="absolute bottom-0 flex flex-col w-full justify-center items-center mb-2">
        <div className="text-md font-semibold">{song.title}</div>
        <div className="text-xs">{song.artist}</div>
      </div>
    </div>
  );
}

export default SongCard;
