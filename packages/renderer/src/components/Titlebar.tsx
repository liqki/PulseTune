import { handleMenuButtons } from "#preload";

function Titlebar() {
  const WebkitAppRegion = {
    WebkitAppRegion: "none",
  } as React.CSSProperties;

  const button = "w-4 h-4 rounded-full focus:outline-none";

  const handleClick = (button: string) => {
    handleMenuButtons(button);
  };

  return (
    <div className="w-screen h-10 bg-[#fcfcfc] dark:bg-[#1b1c26] flex justify-end items-center">
      <ul
        className="pr-2 pt-2 flex justify-end items-center gap-2"
        style={WebkitAppRegion}
      >
        <li>
          <button
            className={`${button} bg-green-500`}
            onClick={() => handleClick("minimize")}
          ></button>
        </li>
        <li>
          <button
            className={`${button} bg-yellow-500`}
            onClick={() => handleClick("maximize")}
          ></button>
        </li>
        <li>
          <button
            className={`${button} bg-red-500`}
            onClick={() => handleClick("close")}
          ></button>
        </li>
      </ul>
    </div>
  );
}

export default Titlebar;
