import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";
import { FaDiscord } from "react-icons/fa";
import { TbReload } from "react-icons/tb";
import { useDarkMode, useDiscordRPC } from "../util/context";
import { disconnectDiscordRPC, discordRPCConnected, reconnectDiscordRPC } from "#preload";

function Settings() {
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const [triggerLoadAnimation, setTriggerLoadAnimation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rpcConnected, setRpcConnected] = useState(false);

  const { darkMode, setDarkMode } = useDarkMode();
  const { discordRPC, setDiscordRPC } = useDiscordRPC();

  const syncRPC = () => discordRPCConnected().then(connected => setRpcConnected(connected));

  useEffect(() => {
    setTimeout(() => {
      syncRPC();
    }, 1000);
    window.ipcRenderer.on("discord-rpc-disconnected", () => {
      console.log("Discord RPC disconnected");
      setRpcConnected(false);
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-start items-end gap-2 p-2">
      <div className="z-50">
        <VscSettingsGear
          className={`text-2xl ${
            triggerAnimation &&
            "animate-spin animate-reverse animate-repeat-[0.5] animate-duration-500"
          }`}
          onClick={() => !triggerAnimation && setTriggerAnimation(true)}
          onAnimationEnd={() => {
            setTriggerAnimation(false);
            setShowSettings(true);
          }}
        />
      </div>
      <ul
        className={`${
          showSettings ? "block" : "hidden"
        } dark:bg-gray-700 rounded-md w-48 flex flex-col gap-1 items-start z-50`}
        onMouseLeave={() => setShowSettings(false)}
      >
        <li className="px-2 flex justify-between items-center w-full">
          <div>Darkmode</div>
          <MdDarkMode
            className="text-lg"
            onClick={() => setDarkMode(!darkMode)}
          />
        </li>
        <li className="px-2 flex justify-between items-center w-full">
          <div>DiscordRPC</div>
          <FaDiscord
            className={`text-lg ${discordRPC ? "text-green-500" : "text-red-400"}`}
            onClick={() => {
              if (discordRPC) {
                setDiscordRPC(false);
                disconnectDiscordRPC();
              } else {
                setDiscordRPC(true);
                reconnectDiscordRPC();
              }
            }}
          />
        </li>
        <li
          className={`${
            ((rpcConnected && discordRPC) || !discordRPC) && "hidden"
          } px-2 flex justify-between items-center w-full`}
        >
          <div>Reconnect Discord</div>
          <TbReload
            className={`text-lg ${
              triggerLoadAnimation && "animate-spin animate-repeat-[2] animate-duration-1000"
            }`}
            onClick={() => {
              setTriggerLoadAnimation(true);
              reconnectDiscordRPC();
              setTimeout(() => syncRPC(), 1000);
            }}
            onAnimationEnd={() => setTriggerLoadAnimation(false)}
          />
        </li>
      </ul>
    </div>
  );
}

export default Settings;
