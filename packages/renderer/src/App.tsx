import "virtual:windi.css";
import React, { useEffect, useState } from "react";
import Titlebar from "./components/Titlebar";
import Page from "./components/Page";
import { FavoritesContext, Folder, FoldersContext, NowPlayingContext } from "./util/context";

function App() {
  const WebkitAppRegion = {
    WebkitAppRegion: "drag",
  } as React.CSSProperties;

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [path, setPath] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    setDarkMode(darkMode === "true");
    const folders = localStorage.getItem("folders");
    if (folders) setFolders(JSON.parse(folders));
    const lastPlayed = localStorage.getItem("lastPlayed");
    if (lastPlayed) setPath(lastPlayed);
    const favorites = localStorage.getItem("favorites");
    if (favorites) setFavorites(JSON.parse(favorites));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (folders.length !== 0) localStorage.setItem("folders", JSON.stringify(folders));
    if (path !== "") localStorage.setItem("lastPlayed", path);
    if (favorites.length !== 0) localStorage.setItem("favorites", JSON.stringify(favorites));
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
