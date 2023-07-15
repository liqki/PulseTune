import "virtual:windi.css";
import React, { useEffect, useState } from "react";
import Titlebar from "./components/Titlebar";
import Page from "./components/Page";
import { FavoritesContext, Folder, FoldersContext, NowPlayingContext } from "./util/context";
import { fileExists, readFiles } from "#preload";

function App() {
  const WebkitAppRegion = {
    WebkitAppRegion: "drag",
  } as React.CSSProperties;

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [path, setPath] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const updateFolders = (folders: Folder[]) => {
    let newFolders: Folder[] = [];
    folders.forEach(async folder => {
      const exists = await fileExists(folder.path);
      if (!exists) return;
      const obj: Folder = { path: folder.path, name: folder.name, files: [] };
      readFiles(folder.path).then(files => (obj.files = files));
      newFolders.push(obj);
    });
    setTimeout(() => setFolders(newFolders), 10);
  };

  const updateFavorites = (favorites: string[]) => {
    let newFavorites: string[] = [];
    favorites.forEach(async favorite => {
      const exists = await fileExists(favorite.substring(8));
      if (!exists) return;
      newFavorites.push(favorite);
    });
    setTimeout(() => setFavorites(newFavorites), 10);
  };

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") || "true";
    setDarkMode(darkMode === "true");
    const folders = localStorage.getItem("folders");
    if (folders) updateFolders(JSON.parse(folders));
    const lastPlayed = localStorage.getItem("lastPlayed");
    if (lastPlayed)
      fileExists(lastPlayed.substring(8)).then(exists => exists && setPath(lastPlayed));
    const favorites = localStorage.getItem("favorites");
    if (favorites) updateFavorites(JSON.parse(favorites));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (folders.length !== 0) {
      localStorage.setItem("folders", JSON.stringify(folders));
    } else {
      localStorage.removeItem("folders");
    }
    if (path !== "") localStorage.setItem("lastPlayed", path);
    if (favorites.length !== 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } else {
      localStorage.removeItem("favorites");
    }
  }, [darkMode, folders, path, favorites]);

  return (
    <FoldersContext.Provider value={{ folders, setFolders }}>
      <FavoritesContext.Provider value={{ favorites, setFavorites }}>
        <NowPlayingContext.Provider value={{ path, setPath }}>
          <div className={`${darkMode && "dark"}`}>
            <div style={WebkitAppRegion}>
              <Titlebar />
            </div>
            <Page />
          </div>
        </NowPlayingContext.Provider>
      </FavoritesContext.Provider>
    </FoldersContext.Provider>
  );
}

export default App;
