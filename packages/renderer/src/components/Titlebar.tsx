import { handleMenuButtons, openExternalLink } from "#preload";
import { useContext, useState } from "react";
import { MdMinimize } from "react-icons/md";
import { VscChromeRestore, VscPrimitiveSquare, VscClose } from "react-icons/vsc";
import { NowPlayingContext } from "../util/context";
import logo from "../assets/icon.png";

function Titlebar() {
  const WebkitAppRegion = {
    WebkitAppRegion: "none",
  } as React.CSSProperties;

  const { path } = useContext(NowPlayingContext);
  const [maximized, setMaximized] = useState<boolean>(false);

  const button = "w-11 h-7 flex justify-center items-center";
  const icon = "w-7 h-5";

  const handleClick = (button: string) => {
    if (button === "maximize") setMaximized(!maximized);
    handleMenuButtons(button);
  };

  return (
    <div className="w-screen h-7 bg-[#fcfcfc] dark:bg-[#1b1c26] flex justify-between items-center text-gray-200">
      <div className="w-33 h-full flex justify-start items-center">
        <img
          src={logo}
          className="w-5 h-5 rounded-full ml-1 cursor-pointer"
          onClick={() => openExternalLink("https://github.com/liqki/music-player")}
          style={WebkitAppRegion}
        />
      </div>
      <div className="">{path.replace(/^.*[\\\/]/, "")}</div>
      <ul
        className="flex justify-end items-center w-33"
        style={WebkitAppRegion}
      >
        <li>
          <div
            className={`${button} hover:bg-[rgba(255,255,255,0.1)]`}
            onClick={() => handleClick("minimize")}
          >
            <MdMinimize className={`${icon}`} />
          </div>
        </li>
        <li>
          <div
            className={`${button} hover:bg-[rgba(255,255,255,0.1)]`}
            onClick={() => handleClick("maximize")}
          >
            {maximized ? (
              <VscChromeRestore className={`${icon}`} />
            ) : (
              <VscPrimitiveSquare className={`${icon}`} />
            )}
          </div>
        </li>
        <li>
          <div
            className={`${button} hover:bg-[#E81123]`}
            onClick={() => handleClick("close")}
          >
            <VscClose className={`${icon}`} />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Titlebar;
