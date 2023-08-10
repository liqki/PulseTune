import { useDarkMode } from "../util/context";

function VolumeSlider({
  volume,
  setVolume,
}: {
  volume: number;
  setVolume: (volume: number) => void;
}) {
  const { darkMode } = useDarkMode();

  return (
    <div>
      <style>
        {`
          @media screen and (-webkit-min-device-pixel-ratio:0) {
            .volume {
              -webkit-appearance: none;
              width: 80px;
              height: 14px;
              border-radius: 1rem;
              transform: rotate(-90deg);
              overflow: hidden;     
              background: linear-gradient(to right, ${darkMode ? "#e5e7eb" : "#484b6a"} 0%, ${
          darkMode ? "#e5e7eb" : "#484b6a"
        } ${volume * 100}%, ${darkMode ? "#374151" : "#d1d5db"} ${volume * 100}%, ${
          darkMode ? "#374151" : "#d1d5db"
        } 100%);         
            }

            .volume::-webkit-slider-runnable-track {
              height: 80px;
              width: 14px;
              -webkit-appearance: none;
            }
          }
        `}
      </style>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={e => setVolume(parseFloat(e.target.value))}
        className="volume"
      />
    </div>
  );
}

export default VolumeSlider;
