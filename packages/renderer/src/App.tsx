import "virtual:windi.css";
import React, { useEffect, useState } from "react";
import Titlebar from "./components/Titlebar";
import Page from "./components/Page";
import {
  DarkModeContext,
  DiscordRPCContext,
  FavoritesContext,
  Folder,
  FoldersContext,
  NowPlayingContext,
} from "./util/context";
import {
  disconnectDiscordRPC,
  fileExists,
  readFiles,
  readFolders,
  reconnectDiscordRPC,
} from "#preload";

function App() {
  const WebkitAppRegion = {
    WebkitAppRegion: "drag",
  } as React.CSSProperties;

  const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem("darkMode") === "true");
  const [path, setPath] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [discordRPC, setDiscordRPC] = useState<boolean>(
    localStorage.getItem("discordRPC") === "true",
  );

  const updateFolders = async (folders: Folder[]) => {
    let newFolders: Folder[] = [];
    for await (const folder of folders) {
      const exists = await fileExists(folder.path);
      if (!exists) return;
      const obj: Folder = { path: folder.path, name: folder.name, files: [], subfolders: [] };
      await readFiles(folder.path).then(files => (obj.files = files));
      await readFolders(folder.path).then(subfolders => (obj.subfolders = subfolders));
      newFolders.push(obj);
    }
    setFolders(newFolders);
  };

  const updateFavorites = async (favorites: string[]) => {
    let newFavorites: string[] = [];
    for await (const favorite of favorites) {
      const exists = await fileExists(favorite.substring(8));
      if (!exists) return;
      newFavorites.push(favorite);
    }
    setFavorites(newFavorites);
  };

  useEffect(() => {
    const folders = localStorage.getItem("folders");
    if (folders) updateFolders(JSON.parse(folders));
    const lastPlayed = localStorage.getItem("lastPlayed");
    if (lastPlayed)
      lastPlayed.startsWith("File://")
        ? fileExists(lastPlayed.substring(8)).then(exists => exists && setPath(lastPlayed))
        : fileExists(lastPlayed).then(exists => exists && setPath(lastPlayed));
    const favorites = localStorage.getItem("favorites");
    if (favorites) updateFavorites(JSON.parse(favorites));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    localStorage.setItem("discordRPC", discordRPC.toString());
    if (discordRPC) {
      reconnectDiscordRPC();
    } else {
      disconnectDiscordRPC();
    }
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
  }, [darkMode, folders, path, favorites, discordRPC]);

  return (
    <FoldersContext.Provider value={{ folders, setFolders }}>
      <FavoritesContext.Provider value={{ favorites, setFavorites }}>
        <NowPlayingContext.Provider value={{ path, setPath }}>
          <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
            <DiscordRPCContext.Provider value={{ discordRPC, setDiscordRPC }}>
              <div className={`${darkMode && "dark"}`}>
                <div style={WebkitAppRegion}>
                  <Titlebar />
                </div>
                <Page />
              </div>
            </DiscordRPCContext.Provider>
          </DarkModeContext.Provider>
        </NowPlayingContext.Provider>
      </FavoritesContext.Provider>
    </FoldersContext.Provider>
  );
}

export default App;
