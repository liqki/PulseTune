import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import SongCard from "./SongCard";
import { useState } from "react";

function DisplaySection({ title, songs }: { title: string; songs: string[] }) {
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center">
        <h2>{title}</h2>
        {title === "Favorites" &&
          (showFavorites ? (
            <AiOutlineEye onClick={() => setShowFavorites(false)} />
          ) : (
            <AiOutlineEyeInvisible onClick={() => setShowFavorites(true)} />
          ))}
      </div>
      {title === "Favorites" ? (
        showFavorites && <Section songs={songs} />
      ) : (
        <Section songs={songs} />
      )}
    </div>
  );
}

function Section({ songs }: { songs: string[] }) {
  return (
    <div className="grid gap-2 grid-cols-[repeat(auto-fill,_160px)] mb-4">
      {songs.map((song, i) => (
        <SongCard
          key={i}
          file={song}
        />
      ))}
    </div>
  );
}

export default DisplaySection;
