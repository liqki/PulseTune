import "virtual:windi.css";
import React, { useState } from "react";
import Titlebar from "./components/Titlebar";
import Page from "./components/Page";
import { Folder, FoldersContext, NowPlayingContext } from "./util/context";

function App() {
  const WebkitAppRegion = {
    WebkitAppRegion: "drag",
  } as React.CSSProperties;

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [path, setPath] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);

  return (
    <FoldersContext.Provider value={{ folders, setFolders }}>
      <NowPlayingContext.Provider value={{ path, setPath }}>
        <div className={`${darkMode && "dark"}`}>
          <div style={WebkitAppRegion}>
            <Titlebar />
          </div>
          <Page />
        </div>
      </NowPlayingContext.Provider>
    </FoldersContext.Provider>
  );
}

export default App;
