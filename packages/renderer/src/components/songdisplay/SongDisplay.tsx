import { useEffect, useState } from "react";
import { Folder, useFavorites, useFolders } from "../../util/context";
import DisplaySection from "./DisplaySection";

function SongDisplay() {
  type Song = {
    title: string;
    artist: string;
    path: string;
  };

  const { favorites } = useFavorites();
  const { folders } = useFolders();

  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [sortedSongs, setSortedSongs] = useState<Song[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");

  const getAllSongs = (folders: Folder[]) => {
    const songs: Song[] = [];
    function traverseDir(folder: Folder) {
      if (folder.files) {
        for (const file of folder.files) {
          songs.push({
            path: folder.path + "\\" + file,
            title: file.split(" - ")[1]?.split(".")[0],
            artist: file.split(" - ")[0],
          });
        }
      }
      if (folder.subfolders) {
        for (const subfolder of folder.subfolders) {
          traverseDir(subfolder);
        }
      }
    }
    for (const folder of folders) {
      traverseDir(folder);
    }
    return songs;
  };

  useEffect(() => {
    setAllSongs(getAllSongs(folders));
  }, [folders]);

  useEffect(() => {
    if (allSongs.length === 0) return setSortedSongs([]);
    setSortedSongs(
      allSongs.sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      }),
    );
  }, [allSongs]);

  return (
    <div className="h-[calc(100%-152px)] w-[calc(100%-260px)] fixed right-10 top-[60px] overflow-y-scroll scrollbar-hide">
      {sortedSongs.length > 0 && (
        <input
          type="text"
          className="w-full h-10 p-2 bg-[#fcfcfc] dark:bg-[#1b1c26] dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:border-gray-500 rounded-full border-2 focus:outline-none focus:border-gray-400 transition-colors mb-2"
          placeholder="Search..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value.toLowerCase())}
        />
      )}
      {favorites.length > 0 && searchInput === "" && (
        <DisplaySection
          title="Favorites"
          songs={favorites}
        />
      )}
      {sortedSongs.length > 0 && searchInput === "" && (
        <DisplaySection
          title="All Songs"
          songs={sortedSongs.map(song => song.path)}
        />
      )}
      {sortedSongs.length > 0 && searchInput !== "" && (
        <DisplaySection
          title="Search Songs"
          songs={sortedSongs
            .filter(
              song =>
                song.title.toLowerCase().includes(searchInput) ||
                song.artist.toLowerCase().includes(searchInput),
            )
            .map(song => song.path)}
        />
      )}
      {sortedSongs.length === 0 && favorites.length === 0 && (
        <div className="h-full w-full flex justify-center items-center">
          <p className="text-gray-400">Add song folders by clicking the +</p>
        </div>
      )}
    </div>
  );
}

export default SongDisplay;
